import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

/**
 * The `docIdentidad` rule on the form (R-REF-8, S-REF-25..27): a test-only entry, so the engine is proved before the real catalogs.
 * The entry runs the same rule, maxWhen and minLenWhen the server does.
 */
const text = (name: string, label: string, extra: Record<string, unknown> = {}) => ({ name, kind: 'text', label, max: 50, normalize: ['upper'], ...extra });
const entry = validateRegistry([{
  slug: 'personas', idKey: 'id_persona', codeWidth: 0, entity: 'un Chofer', scope: 'tenant', seed: 'personas', formId: 'personas', title: 'Chofer', messages: { style: 'M1' },
  fields: [
    { name: 'id_persona', kind: 'code', label: 'Código' },
    { name: 'tipo', kind: 'options', label: 'Tipo de Documento', required: true, display: 'select', options: [{ value: '01', label: 'DNI' }, { value: '05', label: 'RUC' }, { value: '04', label: 'CE' }], default: { INSERT: '01' }, clearsOnChange: ['numero', 'pat', 'mat', 'nom', 'razon'] },
    { name: 'numero', kind: 'text', label: 'DNI/RUC', max: 11, normalize: ['digits'], maxWhen: [{ when: { field: 'tipo', in: ['01'] }, len: 8 }], minLenWhen: [{ when: { field: 'tipo', in: ['01'] }, len: 8 }, { when: { field: 'tipo', in: ['05'] }, len: 11 }] },
    text('pat', 'Apellido Paterno'), text('mat', 'Apellido Materno'), text('nom', 'Nombres', { msgLabel: 'su Nombre' }), text('razon', 'Razón Social', { max: 300, msgLabel: 'su Descripcion' }),
  ],
  columns: [{ key: 'razon', header: 'Razón' }],
  rules: [{ name: 'docIdentidad', params: { tipo: 'tipo', numero: 'numero', paterno: 'pat', materno: 'mat', nombres: 'nom', razon: 'razon', persona: 'flag' } }],
  validation: ['tipo', { rule: 'docIdentidad' }, 'numero', 'pat', 'mat', 'nom', 'razon'],
}]).bySlug.get('personas');
const config = toCatalogConfig(entry);

async function open() {
  const user = userEvent.setup();
  const service = { get: vi.fn(), create: vi.fn(async (values: object) => ({ id_persona: '9', ...values })), update: vi.fn(), remove: vi.fn() };
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service as unknown as InterCatalogService<Record<string, string>>} mode="INSERT" onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
type User = ReturnType<typeof userEvent.setup>;
const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const tipo = () => screen.getByLabelText('Tipo de Documento') as HTMLSelectElement;
const submit = (user: User) => user.click(screen.getByRole('button', { name: 'Aceptar' }));
const chooseTipo = (user: User, label: string) => user.selectOptions(tipo(), label);
const names = async (user: User) => {
  await user.type(input('Apellido Paterno'), 'perez');
  await user.type(input('Apellido Materno'), 'lopez');
  await user.type(input('Nombres'), 'ana');
};

describe('S-REF-25 DNI form', () => {
  it('starts on DNI: the number takes 8 digits, the names are open and the razon social is hidden', async () => {
    await open();
    expect(tipo().value).toBe('01');
    expect(input('Apellido Paterno').readOnly).toBe(false);
    expect(screen.queryByLabelText('Razón Social')).toBeNull();
  });

  it('maxWhen: a ninth digit is ignored', async () => {
    const { user } = await open();
    await user.type(input('DNI/RUC'), '123456789');
    expect(input('DNI/RUC').value).toBe('12345678');
  });

  it('a DNI of 7 digits blocks the submit with the DNI sentence under the number', async () => {
    const { user, service } = await open();
    await user.type(input('DNI/RUC'), '1234567');
    await names(user);
    await submit(user);
    expect(screen.getByText('El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('a blank materno names the entity and the field, and the field takes the focus', async () => {
    const { user } = await open();
    await user.type(input('DNI/RUC'), '12345678');
    await user.type(input('Apellido Paterno'), 'perez');
    await submit(user);
    expect(screen.getByText('Para agregar un Chofer, debes especificar su Apellido Materno.')).toBeTruthy();
    expect(document.activeElement).toBe(input('Apellido Materno'));
  });

  it('sends the typed names and a null razon social (the server composes it)', async () => {
    const { user, service } = await open();
    await user.type(input('DNI/RUC'), '12345678');
    await names(user);
    await submit(user);
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledTimes(1));
    expect(service.create.mock.calls[0][0]).toMatchObject({ tipo: '01', numero: '12345678', pat: 'PEREZ', mat: 'LOPEZ', nom: 'ANA', razon: null });
  });
});

describe('S-REF-27 the tipo change', () => {
  it('clears the number, the names and the razon social, and the number takes 11 digits', async () => {
    const { user } = await open();
    await user.type(input('DNI/RUC'), '12345678');
    await names(user);
    await chooseTipo(user, 'CE');
    expect(input('DNI/RUC').value).toBe('');
    expect(input('Apellido Paterno').value).toBe('');
    expect(input('Nombres').value).toBe('');
    expect(input('Razón Social').value).toBe('');
    await user.type(input('DNI/RUC'), '123456789012');
    expect(input('DNI/RUC').value).toBe('12345678901');
  });

  it('another tipo: names disabled, razon social shown and required, no minimum on the number', async () => {
    const { user, service } = await open();
    await chooseTipo(user, 'CE');
    expect(input('Apellido Paterno').readOnly).toBe(true);
    expect(input('Razón Social').readOnly).toBe(false);
    await user.type(input('DNI/RUC'), '1');
    await submit(user);
    expect(screen.getByText('Para agregar un Chofer, debes especificar su Descripcion.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });
});

describe('S-REF-26 RUC form', () => {
  it('a RUC of 10 digits blocks with the RUC sentence (minLenWhen and the rule agree)', async () => {
    const { user } = await open();
    await chooseTipo(user, 'RUC');
    await user.type(input('DNI/RUC'), '2012345678');
    await user.type(input('Razón Social'), 'acme');
    await submit(user);
    expect(screen.getByText('El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.')).toBeTruthy();
  });

  it('a first digit 1 asks for the names and hides the razon social; a 2 shows it with the names disabled', async () => {
    const { user } = await open();
    await chooseTipo(user, 'RUC');
    expect(input('Razón Social')).toBeTruthy();
    await user.type(input('DNI/RUC'), '1');
    expect(screen.queryByLabelText('Razón Social')).toBeNull();
    expect(input('Apellido Paterno').readOnly).toBe(false);
    await user.clear(input('DNI/RUC'));
    await user.type(input('DNI/RUC'), '2');
    expect(input('Razón Social').readOnly).toBe(false);
    expect(input('Apellido Paterno').readOnly).toBe(true);
  });

  it('a first digit 3 shows the alert and clears the number', async () => {
    const { user } = await open();
    await chooseTipo(user, 'RUC');
    await user.type(input('DNI/RUC'), '3');
    expect((await screen.findByRole('alert')).textContent).toContain('EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2');
    expect(input('DNI/RUC').value).toBe('');
  });

  it('the alert goes with the next edit', async () => {
    const { user } = await open();
    await chooseTipo(user, 'RUC');
    await user.type(input('DNI/RUC'), '3');
    await screen.findByRole('alert');
    await user.type(input('DNI/RUC'), '1');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('the razon social is composed on every keystroke: it shows when the RUC turns juridical', async () => {
    const { user } = await open();
    await chooseTipo(user, 'RUC');
    await user.type(input('DNI/RUC'), '1');
    await user.type(input('Apellido Paterno'), 'p');
    expect(screen.queryByLabelText('Razón Social')).toBeNull();
    await user.type(input('Apellido Materno'), 'l');
    await user.type(input('Nombres'), 'a');
    await user.clear(input('DNI/RUC'));
    await waitFor(() => expect(input('Razón Social').value).toBe('P L A'));
  });

  it('typing a letter into the number is ignored (digits only)', async () => {
    const { user } = await open();
    await chooseTipo(user, 'RUC');
    fireEvent.change(input('DNI/RUC'), { target: { value: 'ab' } });
    expect(input('DNI/RUC').value).toBe('');
  });
});
