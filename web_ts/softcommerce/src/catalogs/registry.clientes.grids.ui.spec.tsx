import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PERMISSION_FLAGS, type Permissions } from '../domain/permissions';
import { ServicesProvider } from '../services/ServicesContext';
import { createAppServicesMock } from '../services/mock/AppServicesMock';
import { seed } from '../services/mock/seed';
import { SessionProvider } from '../session/SessionProvider';
import { createSessionStore, type Session } from '../session/sessionStore';
import { UiCatalog } from '../views/uicatalog';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { withBancos } from '../../test/catalogs/bancosSeed';
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `clientes` entry over the demo seed (user 7) against the in-browser mock, with the session params given (S-MST-22, S-MST-23, S-MD-1..3, S-MD-6, S-MD-7 on the real Cliente). */
function renderClientes(params: Record<string, unknown> = { IS_CLIENTE_CONDICION_PAGO: true, IS_DIRECCION_CLIENTE: true }) {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7' }), delayMs: 0, seed: withBancos(seed) });
  const store = createSessionStore(window.localStorage);
  store.setSession({ params } as unknown as Session);
  render(
    <SessionProvider store={store}>
      <ServicesProvider services={services}>
        <DialogStackProvider>
          <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('clientes'), REGISTRY)} permissions={granted} />
        </DialogStackProvider>
      </ServicesProvider>
    </SessionProvider>,
  );
  return { user: userEvent.setup(), services };
}
type User = ReturnType<typeof userEvent.setup>;
const panel = (name: string) => screen.getByRole('tabpanel', { name, hidden: true });
const childDialog = (tab: string) => screen.getByText(`Nuevo: ${tab}`).closest<HTMLElement>('[role="dialog"]') as HTMLElement;
const options = (root: HTMLElement, label: string) => [...(within(root).getByLabelText(label) as HTMLSelectElement).options].map((o) => o.textContent);
const state = (root: HTMLElement, row: string) => within(within(root).getByText(row).closest('tr') as HTMLElement).getByRole('img').getAttribute('aria-label');
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);

async function openUpdate(user: User) {
  await user.click(await screen.findByText('COMERCIAL LOS ANDES SAC'));
  await user.click(screen.getByRole('button', { name: 'Modificar' }));
  await screen.findByLabelText('Tipo de Documento');
}
async function openDialog(user: User, tab: string) {
  await user.click(screen.getByRole('tab', { name: tab }));
  await user.click(within(panel(tab)).getByRole('button', { name: 'Agregar' }));
  return waitFor(() => childDialog(tab));
}
const accept = (user: User, dialog: HTMLElement) => user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
const choose = async (user: User, dialog: HTMLElement, label: string, text: string) => {
  await waitFor(() => expect(options(dialog, label)).toContain(text));
  await user.selectOptions(within(dialog).getByLabelText(label), text);
};

describe('S-MD-3 the Direcciones grid shows the history of the real Cliente', () => {
  it('lists the active and the deactivated direccion with their state icon and not the deleted one', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    await user.click(screen.getByRole('tab', { name: 'Direcciones' }));
    const grid = panel('Direcciones');
    await within(grid).findByText('AV. AREQUIPA 2450');
    expect([state(grid, 'AV. AREQUIPA 2450'), state(grid, 'AV. NICOLAS AYLLON 100')]).toEqual(['Activo', 'Desactivado']);
    expect(within(grid).queryByText('JR. BORRADA 1')).toBeNull();
    for (const header of ['UBIGEO', 'ZONA', 'DIRECCION']) expect(within(grid).getByText(header)).toBeTruthy();
  });

  it('the register tabs are General, Activación de Cliente, Direcciones, Contactos and Cuentas (the gated and padron tabs come with W3-17)', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    expect(within(screen.getByRole('dialog')).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['General', 'Activación de Cliente', 'Direcciones', 'Contactos', 'Cuentas']);
  });
});

describe('S-MST-22 the Direccion dialog', () => {
  it('asks departamento, provincia, distrito and then the direccion, with the bare desktop sentences; the zona is optional with IS_DIRECCION_CLIENTE true', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    const dialog = await openDialog(user, 'Direcciones');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Debes Seleccionar un Departamento.')).toBeTruthy();
    await choose(user, dialog, 'Departamento', 'LIMA');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Debes Seleccionar una Provincia.')).toBeTruthy();
    await choose(user, dialog, 'Provincia', 'LIMA');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Debes Seleccionar un Distrito.')).toBeTruthy();
    await choose(user, dialog, 'Distrito', 'ATE');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Debes Ingresar Direccion.')).toBeTruthy();
    expect(within(dialog).queryByText('Debes Seleccionar una Zona.')).toBeNull();
    await user.type(within(dialog).getByLabelText('Direccion'), 'av nueva 5');
    await accept(user, dialog);
    await confirmLast(user);
    await waitFor(() => expect(within(panel('Direcciones')).getByText('AV NUEVA 5')).toBeTruthy());
  });

  it('with IS_DIRECCION_CLIENTE false the cascade offers only the ubigeos with a zona and the zona is required, before the direccion', async () => {
    const { user } = renderClientes({ IS_CLIENTE_CONDICION_PAGO: true, IS_DIRECCION_CLIENTE: false });
    await openUpdate(user);
    const dialog = await openDialog(user, 'Direcciones');
    await waitFor(() => expect(options(dialog, 'Departamento')).toEqual(['Seleccione', 'CALLAO', 'LIMA']));
    await choose(user, dialog, 'Departamento', 'LIMA');
    await choose(user, dialog, 'Provincia', 'LIMA');
    await choose(user, dialog, 'Distrito', 'ATE');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Debes Seleccionar una Zona.')).toBeTruthy();
    await choose(user, dialog, 'Zona', 'ATE ESTE');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Debes Ingresar Direccion.')).toBeTruthy();
  });

  it('with the parameter true the cascade offers every departamento', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    const dialog = await openDialog(user, 'Direcciones');
    await waitFor(() => expect(options(dialog, 'Departamento').length).toBeGreaterThan(3));
  });
});

describe('S-MD-6 Quitar on the Direcciones of the real Cliente', () => {
  it('says what to do with no selection, deactivates a persisted row after the question and refuses it the second time', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    await user.click(screen.getByRole('tab', { name: 'Direcciones' }));
    const grid = panel('Direcciones');
    await within(grid).findByText('AV. AREQUIPA 2450');
    await user.click(within(grid).getByRole('button', { name: 'Quitar' }));
    expect(within(grid).getByRole('status').textContent).toBe('Para quitar una direccion primero debe seleccionar la fila.');
    await user.click(within(grid).getByText('AV. AREQUIPA 2450'));
    await user.click(within(grid).getByRole('button', { name: 'Quitar' }));
    expect(await screen.findByText('Desea Quitar Direccion?')).toBeTruthy();
    await confirmLast(user);
    await waitFor(() => expect(state(grid, 'AV. AREQUIPA 2450')).toBe('Desactivado'));
    await user.click(within(grid).getByText('AV. AREQUIPA 2450'));
    await user.click(within(grid).getByRole('button', { name: 'Quitar' }));
    expect(within(grid).getByRole('status').textContent).toBe('Direccion ya Esta desactivada');
  });
});

describe('S-MST-23 the Contacto and Cuenta dialogs', () => {
  it('a blank contacto asks paterno, materno and nombres in that order', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    const dialog = await openDialog(user, 'Contactos');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Ingrese Apellido Paterno')).toBeTruthy();
    await user.type(within(dialog).getByLabelText('Paterno'), 'luna');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Ingrese Apellido Materno')).toBeTruthy();
    await user.type(within(dialog).getByLabelText('Materno'), 'rios');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Ingrese Nombres')).toBeTruthy();
  });

  it('a cuenta: Seleccione Banco, then the banco name is read-only and filled, and OTROS makes it editable and required, then Ingrese Numero de Cuenta', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    const dialog = await openDialog(user, 'Cuentas');
    await waitFor(() => expect(options(dialog, 'Banco')).toEqual(['--- Seleccione ---', 'BANCO DE CREDITO DEL PERU', 'INTERBANK', 'OTROS']));
    await accept(user, dialog);
    expect(await within(dialog).findByText('Seleccione Banco')).toBeTruthy();
    const nombre = () => within(dialog).getByLabelText('Nombre') as HTMLInputElement;
    expect([nombre().value, nombre().readOnly]).toEqual(['', true]);
    await user.selectOptions(within(dialog).getByLabelText('Banco'), 'INTERBANK');
    expect([nombre().value, nombre().readOnly]).toEqual(['INTERBANK', true]);
    await accept(user, dialog);
    expect(await within(dialog).findByText('Ingrese Numero de Cuenta')).toBeTruthy();
    await user.selectOptions(within(dialog).getByLabelText('Banco'), 'OTROS');
    expect([nombre().value, nombre().readOnly]).toEqual(['', false]);
    await accept(user, dialog);
    expect(await within(dialog).findByText('Ingrese Nombre de Banco')).toBeTruthy();
    await user.type(nombre(), 'caja sur');
    await user.type(within(dialog).getByLabelText('Cuenta'), '0099');
    await accept(user, dialog);
    await confirmLast(user);
    await waitFor(() => expect(within(panel('Cuentas')).getByText('CAJA SUR')).toBeTruthy());
  });

  it('S-MD-7 Quitar on the Cuentas with no selected row says Seleccione Fila.', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    await user.click(screen.getByRole('tab', { name: 'Cuentas' }));
    const grid = panel('Cuentas');
    await within(grid).findByText('BANCO DE CREDITO DEL PERU');
    await user.click(within(grid).getByRole('button', { name: 'Quitar' }));
    expect(within(grid).getByRole('status').textContent).toBe('Seleccione Fila.');
  });
});

describe('S-MD-1 / S-MD-2 on the real Cliente', () => {
  it('S-MD-2 a pending direccion and the General data survive switching tabs', async () => {
    const { user } = renderClientes();
    await user.click(await screen.findByRole('button', { name: 'Agregar' }));
    await screen.findByLabelText('Tipo de Documento');
    await user.type(screen.getByLabelText('Telefono Fijo'), '5551234');
    const dialog = await openDialog(user, 'Direcciones');
    await choose(user, dialog, 'Departamento', 'LIMA');
    await choose(user, dialog, 'Provincia', 'LIMA');
    await choose(user, dialog, 'Distrito', 'ATE');
    await user.type(within(dialog).getByLabelText('Direccion'), 'av pendiente 9');
    await accept(user, dialog);
    await confirmLast(user);
    await waitFor(() => expect(within(panel('Direcciones')).getByText('AV PENDIENTE 9')).toBeTruthy());
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect((screen.getByLabelText('Telefono Fijo') as HTMLInputElement).value).toBe('5551234');
    await user.click(screen.getByRole('tab', { name: 'Direcciones' }));
    expect(within(panel('Direcciones')).getAllByText('AV PENDIENTE 9')).toHaveLength(1);
  });

  it('S-MD-1 a blank nacionalidad submitted from Direcciones goes back to General and shows its sentence', async () => {
    const { user } = renderClientes();
    await user.click(await screen.findByRole('button', { name: 'Agregar' }));
    await screen.findByLabelText('Tipo de Documento');
    await user.selectOptions(screen.getByLabelText('Tipo de Documento'), '05');
    await user.type(screen.getByLabelText('DNI/RUC'), '20123456789');
    await user.type(screen.getByLabelText('Razón Social'), 'acme sac');
    await waitFor(() => expect((screen.getByLabelText('Tipo Cliente') as HTMLSelectElement).options.length).toBe(2));
    await user.selectOptions(screen.getByLabelText('Tipo Cliente'), '1');
    await waitFor(() => expect((screen.getByLabelText('Nacionalidad') as HTMLSelectElement).selectedOptions[0]?.textContent).toBe('PERUANA'));
    await user.selectOptions(screen.getByLabelText('Nacionalidad'), '');
    await user.click(screen.getByRole('tab', { name: 'Direcciones' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un Cliente, debes Seleccionar una Nacionalidad.')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'General' }).getAttribute('aria-selected')).toBe('true');
  });
});
