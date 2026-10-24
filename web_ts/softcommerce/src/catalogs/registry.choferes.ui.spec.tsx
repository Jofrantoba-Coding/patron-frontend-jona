import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PERMISSION_FLAGS, type Permissions } from '../domain/permissions';
import { ServicesProvider } from '../services/ServicesContext';
import { createAppServicesMock } from '../services/mock/AppServicesMock';
import { seed } from '../services/mock/seed';
import { UiCatalog } from '../views/uicatalog';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `choferes` or `socios` entry over the demo seed (user 7, empresa 1), against the in-browser mock. */
function renderCatalog(slug: string) {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get(slug))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const input = (label: string) => screen.getAllByLabelText(label).find((e) => e.tagName === 'INPUT') as HTMLInputElement;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const options = (label: string) => [...select(label).options].map((o) => o.textContent);
const selected = (label: string) => select(label).selectedOptions[0]?.textContent;
const dialog = () => screen.getByRole('dialog');
const submit = (user: User) => user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
const confirm = async (user: User) => user.click(await screen.findByRole('button', { name: 'Confirmar' }));
const choose = async (user: User, label: string, text: string) => {
  await waitFor(() => expect(options(label)).toContain(text));
  await user.selectOptions(select(label), text);
};

async function openAdd() {
  const user = renderCatalog('choferes');
  await screen.findByText('RAMOS DIAZ LUIS');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Tipo de Documento');
  await waitFor(() => expect(selected('Nacionalidad')).toBe('PERUANA'));
  return user;
}
const fillDni = async (user: User, numero = '12345678') => {
  await user.type(input('DNI/RUC'), numero);
  await user.type(input('Apellido Paterno'), 'perez');
  await user.type(input('Apellido Materno'), 'lopez');
  await user.type(input('Nombres'), 'ana');
};

describe('chofer list and toolbar (S-REF-29, S-REF-39)', () => {
  it('lists the active choferes with their joined tipo and nacionalidad', async () => {
    renderCatalog('choferes');
    expect(await screen.findByText('RAMOS DIAZ LUIS')).toBeTruthy();
    expect(screen.getByText('TRANSPORTES ANDINOS SAC')).toBeTruthy();
    expect(screen.queryByText('TORRES VEGA ANA')).toBeNull();
    expect(screen.getAllByText('EXTRANJERA').length).toBeGreaterThan(0);
  });

  it('S-REF-29 the toolbar offers no Eliminar: the delete mode is not supported', async () => {
    renderCatalog('choferes');
    await screen.findByText('RAMOS DIAZ LUIS');
    expect(screen.queryByRole('button', { name: 'Eliminar' })).toBeNull();
    for (const name of ['Agregar', 'Modificar', 'Clonar']) expect(screen.getByRole('button', { name })).toBeTruthy();
  });

  it('S-REF-39 the form has no percepcion, retencion or exceptuado flags (the activation tab is W3, S-REF-40)', async () => {
    await openAdd();
    for (const text of [/Percepcion/i, /Retencion/i, /Exceptuado/i]) expect(screen.queryByText(text)).toBeNull();
  });
});

describe('chofer INSERT (S-REF-25, S-REF-26)', () => {
  it('starts on DNI and PERUANA, offers only the active person tipos, hides the razon social and shows the sexo', async () => {
    await openAdd();
    expect(selected('Tipo de Documento')).toBe('DNI');
    await waitFor(() => expect(options('Tipo de Documento')).toEqual(expect.arrayContaining(['DNI', 'CE', 'RUC'])));
    expect(options('Tipo de Documento')).not.toContain('SD');
    expect(options('Tipo de Documento')).not.toContain('PAS');
    expect(screen.queryByLabelText('Razón Social')).toBeNull();
    expect((screen.getByRole('radio', { name: 'Masculino' }) as HTMLInputElement).checked).toBe(true);
  });

  it('S-REF-25 a DNI of 7 digits shows the DNI sentence', async () => {
    const user = await openAdd();
    await fillDni(user, '1234567');
    await submit(user);
    expect(screen.getByText('El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.')).toBeTruthy();
  });

  it('S-REF-25 a blank materno shows the M1 sentence with Chofer', async () => {
    const user = await openAdd();
    await user.type(input('DNI/RUC'), '12345678');
    await user.type(input('Apellido Paterno'), 'perez');
    await submit(user);
    expect(screen.getByText('Para agregar un Chofer, debes especificar su Apellido Materno.')).toBeTruthy();
  });

  it('S-REF-25 saves a DNI chofer and the list shows the composed PEREZ LOPEZ ANA', async () => {
    const user = await openAdd();
    await fillDni(user);
    await submit(user);
    await confirm(user);
    expect(await screen.findByText('PEREZ LOPEZ ANA')).toBeTruthy();
  });

  it('a blank nacionalidad shows the MS sentence', async () => {
    const user = await openAdd();
    await fillDni(user);
    await user.selectOptions(select('Nacionalidad'), '');
    await submit(user);
    expect(screen.getByText('Para agregar un Chofer, debes Seleccionar una Nacionalidad.')).toBeTruthy();
  });

  it('S-REF-26 a RUC starting with 2 asks for the razon social, disables the names and hides the sexo', async () => {
    const user = await openAdd();
    await choose(user, 'Tipo de Documento', 'RUC');
    await user.type(input('DNI/RUC'), '20123456789');
    expect(input('Razón Social').readOnly).toBe(false);
    expect(input('Apellido Paterno').readOnly).toBe(true);
    expect(screen.queryByRole('radio', { name: 'Masculino' })).toBeNull();
    // The razon social is required: the submit stops there.
    await submit(user);
    expect(screen.getByText('Para agregar un Chofer, debes especificar su Descripcion.')).toBeTruthy();
  });

  it('S-REF-26 a RUC starting with 3 alerts and clears the number', async () => {
    const user = await openAdd();
    await choose(user, 'Tipo de Documento', 'RUC');
    await user.type(input('DNI/RUC'), '3');
    expect((await screen.findByRole('alert')).textContent).toContain('EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2');
    expect(input('DNI/RUC').value).toBe('');
  });

  it('S-REF-27 changing the tipo clears the number and the names', async () => {
    const user = await openAdd();
    await fillDni(user);
    await choose(user, 'Tipo de Documento', 'RUC');
    expect(input('DNI/RUC').value).toBe('');
    expect(input('Apellido Paterno').value).toBe('');
  });
});

describe('chofer UPDATE and CLONE (S-REF-29 [DEVIATION])', () => {
  it('UPDATE of the RUC chofer restores its tipo RUC and nacionalidad EXTRANJERA, not DNI / PERUANA', async () => {
    const user = renderCatalog('choferes');
    await user.click(await screen.findByText('TRANSPORTES ANDINOS SAC'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Tipo de Documento');
    await waitFor(() => expect(selected('Nacionalidad')).toBe('EXTRANJERA'));
    expect(selected('Tipo de Documento')).toBe('RUC');
    expect(input('DNI/RUC').value).toBe('20512345678');
    expect(input('Razón Social').value).toBe('TRANSPORTES ANDINOS SAC');
  });

  it('UPDATE of the DNI chofer keeps its names and hides the razon social', async () => {
    const user = renderCatalog('choferes');
    await user.click(await screen.findByText('RAMOS DIAZ LUIS'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Tipo de Documento');
    await waitFor(() => expect(input('Apellido Paterno').value).toBe('RAMOS'));
    expect(screen.queryByLabelText('Razón Social')).toBeNull();
  });

  it('CLONE copies the stored tipo and nacionalidad too', async () => {
    const user = renderCatalog('choferes');
    await user.click(await screen.findByText('TRANSPORTES ANDINOS SAC'));
    await user.click(screen.getByRole('button', { name: 'Clonar' }));
    await screen.findByLabelText('Tipo de Documento');
    await waitFor(() => expect(selected('Nacionalidad')).toBe('EXTRANJERA'));
    expect(selected('Tipo de Documento')).toBe('RUC');
  });
});
