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

/** The real `socios` entry over the demo seed, against the in-browser mock (a socio needs no session context). */
function renderSocios() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({}), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('socios'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const input = (label: string) => screen.getAllByLabelText(label).find((e) => e.tagName === 'INPUT') as HTMLInputElement;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const selected = (label: string) => select(label).selectedOptions[0]?.textContent;
const submit = (user: User) => user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Aceptar' }));
const confirm = async (user: User) => user.click(await screen.findByRole('button', { name: 'Confirmar' }));

async function openAdd() {
  const user = renderSocios();
  await screen.findByText('RAMOS DIAZ LUIS');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Tipo de Documento');
  return user;
}
const choose = async (user: User, text: string) => {
  await waitFor(() => expect([...select('Tipo de Documento').options].map((o) => o.textContent)).toContain(text));
  await user.selectOptions(select('Tipo de Documento'), text);
};

describe('socio register (S-REF-28, S-MOCK-32)', () => {
  it('lists the active socios; the toolbar has no Eliminar (S-REF-29)', async () => {
    renderSocios();
    expect(await screen.findByText('RAMOS DIAZ LUIS')).toBeTruthy();
    expect(screen.queryByText('SOTO PAZ RUTH')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).toBeNull();
  });

  it('INSERT starts on no tipo: the number and the names are closed until one is chosen', async () => {
    await openAdd();
    expect(selected('Tipo de Documento')).toBe('--- Seleccione ---');
    expect(input('DNI/RUC').readOnly).toBe(true);
    expect(input('Apellido Paterno').readOnly).toBe(true);
  });

  it('the estado is checked and read-only on create', async () => {
    await openAdd();
    const estado = screen.getByRole('checkbox', { name: 'Activo' }) as HTMLInputElement;
    expect([estado.checked, estado.disabled || estado.readOnly]).toEqual([true, true]);
  });

  it('a blank form says Seleccionar un Tipo de Documento with the real entity [DEVIATION]', async () => {
    const user = await openAdd();
    await submit(user);
    expect(screen.getByText('Para agregar un Socio, debes Seleccionar un Tipo de Documento.')).toBeTruthy();
  });

  it('S-REF-28 saves a juridical RUC socio with its razon social', async () => {
    const user = await openAdd();
    await choose(user, 'RUC');
    await user.type(input('DNI/RUC'), '20123456789');
    await user.type(input('Razón Social'), 'acme sac');
    await submit(user);
    await confirm(user);
    expect(await screen.findByText('ACME SAC')).toBeTruthy();
  });

  it('S-REF-26 the RUC sentence for a short RUC', async () => {
    const user = await openAdd();
    await choose(user, 'RUC');
    await user.type(input('DNI/RUC'), '2012345');
    await submit(user);
    expect(screen.getByText('El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.')).toBeTruthy();
  });

  it('UPDATE restores the tipo and shows the razon social of the RUC socio', async () => {
    const user = renderSocios();
    await user.click(await screen.findByText('TRANSPORTES ANDINOS SAC'));
    await user.click(screen.getByRole('button', { name: 'Modificar' }));
    await screen.findByLabelText('Tipo de Documento');
    await waitFor(() => expect(selected('Tipo de Documento')).toBe('RUC'));
    expect(input('Razón Social').value).toBe('TRANSPORTES ANDINOS SAC');
  });
});
