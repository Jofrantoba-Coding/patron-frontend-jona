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
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `clientes` entry over the demo seed (user 7) with the session params given (S-MST-24, S-LKP-9 on the real Cliente). */
function renderClientes(params: Record<string, unknown> = { IS_CLIENTE_SUSTITUTO: true }) {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7' }), delayMs: 0, seed: seed });
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
const state = (root: HTMLElement, row: string) => within(within(root).getByText(row).closest('tr') as HTMLElement).getByRole('img').getAttribute('aria-label');
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
const picker = async () => (await screen.findByText('Buscar Cliente')).closest<HTMLElement>('[role="dialog"]') as HTMLElement;
const notice = (grid: HTMLElement) => within(grid).getByRole('status').textContent;

async function openUpdate(user: User, cliente = 'COMERCIAL LOS ANDES SAC') {
  await user.click(await screen.findByText(cliente));
  await user.click(screen.getByRole('button', { name: 'Modificar' }));
  await screen.findByLabelText('Tipo de Documento');
}
async function openSustitutos(user: User, cliente = 'COMERCIAL LOS ANDES SAC') {
  await openUpdate(user, cliente);
  await user.click(screen.getByRole('tab', { name: 'Sustitutos' }));
  return panel('Sustitutos');
}

describe('R-MST-12 the Sustitutos tab is behind IS_CLIENTE_SUSTITUTO', () => {
  it('shows after Direcciones with the parameter true', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    expect(within(screen.getByRole('dialog')).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['General', 'Activación de Cliente', 'Direcciones', 'Sustitutos', 'Contactos', 'Cuentas']);
  });

  it('with the parameter false there is no Sustitutos tab and the list has no CANT_SUST column', async () => {
    const { user } = renderClientes({ IS_CLIENTE_SUSTITUTO: false });
    await screen.findByText('COMERCIAL LOS ANDES SAC');
    expect(screen.queryByRole('columnheader', { name: 'CANT_SUST' })).toBeNull();
    await openUpdate(user);
    expect(screen.queryByRole('tab', { name: 'Sustitutos' })).toBeNull();
  });

  it('the list shows CANT_SUST with the count of the active sustitutos', async () => {
    renderClientes();
    await screen.findByText('COMERCIAL LOS ANDES SAC');
    const column = screen.getAllByRole('columnheader').map((h) => h.textContent).indexOf('CANT_SUST');
    expect(column).toBeGreaterThan(-1);
    const cells = within(screen.getByText('COMERCIAL LOS ANDES SAC').closest('tr') as HTMLElement).getAllByRole('cell');
    expect(cells[column].textContent).toBe('1');
  });
});

describe('S-MST-24 the Sustitutos grid and its actions', () => {
  it('lists the sustitutos with the data of the cliente and the state icon, with no Quitar', async () => {
    const { user } = renderClientes();
    const grid = await openSustitutos(user);
    await within(grid).findByText('RAMOS DIAZ ELENA');
    expect([state(grid, 'RAMOS DIAZ ELENA'), state(grid, 'KIM TRADING')]).toEqual(['Activo', 'Desactivado']);
    for (const header of ['RUC/DNI', 'RAZON SOCIAL', 'DIRECCION', 'AP', 'AR', 'EX']) expect(within(grid).getByText(header)).toBeTruthy();
    expect(within(grid).queryByRole('button', { name: 'Quitar' })).toBeNull();
  });

  it('no selection says Seleccionar un Elemento. for Activar and for Desactivar', async () => {
    const { user } = renderClientes();
    const grid = await openSustitutos(user);
    await within(grid).findByText('RAMOS DIAZ ELENA');
    await user.click(within(grid).getByRole('button', { name: 'Activar' }));
    expect(notice(grid)).toBe('Seleccionar un Elemento.');
    await user.click(within(grid).getByRole('button', { name: 'Desactivar' }));
    expect(notice(grid)).toBe('Seleccionar un Elemento.');
  });

  it('Activar on an active row says Sustituto ya esta activado; on a deactivated row of a deactivated cliente, Cliente esta desactivado', async () => {
    const { user } = renderClientes();
    const grid = await openSustitutos(user);
    await user.click(await within(grid).findByText('RAMOS DIAZ ELENA'));
    await user.click(within(grid).getByRole('button', { name: 'Activar' }));
    expect(notice(grid)).toBe('Sustituto ya esta activado');
    await user.click(within(grid).getByText('KIM TRADING'));
    await user.click(within(grid).getByRole('button', { name: 'Activar' }));
    expect(notice(grid)).toBe('Cliente esta desactivado');
  });

  it('Desactivar on a deactivated row says Sustituto ya esta desactivado; on an active one it asks Desea Desactivar Cliente Sustituto? and closes the row', async () => {
    const { user } = renderClientes();
    const grid = await openSustitutos(user);
    await user.click(await within(grid).findByText('KIM TRADING'));
    await user.click(within(grid).getByRole('button', { name: 'Desactivar' }));
    expect(notice(grid)).toBe('Sustituto ya esta desactivado');
    await user.click(within(grid).getByText('RAMOS DIAZ ELENA'));
    await user.click(within(grid).getByRole('button', { name: 'Desactivar' }));
    expect(await screen.findByText('Desea Desactivar Cliente Sustituto?')).toBeTruthy();
    await confirmLast(user);
    await waitFor(() => expect(state(grid, 'RAMOS DIAZ ELENA')).toBe('Desactivado'));
  });
});

describe('S-LKP-9 Agregar opens FormClienteBuscar with the host veto', () => {
  it('lists the active clientes only and a cliente already in the grid is vetoed: the dialog stays open and the grid does not change', async () => {
    const { user } = renderClientes();
    const grid = await openSustitutos(user);
    await within(grid).findByText('RAMOS DIAZ ELENA');
    await user.click(within(grid).getByRole('button', { name: 'Agregar' }));
    const dialog = await picker();
    await within(dialog).findByText('COMERCIAL LOS ANDES SAC');
    expect(within(dialog).queryByText('KIM TRADING')).toBeNull();
    await user.click(within(dialog).getByText('RAMOS DIAZ ELENA'));
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    expect(await within(dialog).findByText('Cliente ya Esta Agregado')).toBeTruthy();
    expect(within(grid).getAllByText('RAMOS DIAZ ELENA')).toHaveLength(1);
  });

  it('the cliente being edited is vetoed too [ASSUMPTION]', async () => {
    const { user } = renderClientes();
    const grid = await openSustitutos(user);
    await user.click(await within(grid).findByRole('button', { name: 'Agregar' }));
    const dialog = await picker();
    await user.click(await within(dialog).findByText('COMERCIAL LOS ANDES SAC'));
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    expect(await within(dialog).findByText('Cliente ya Esta Agregado')).toBeTruthy();
  });

  it('a pick that passes adds a pending row with its data, closes the dialog, and the save sends it', async () => {
    const { user, services } = renderClientes();
    const grid = await openSustitutos(user, 'RAMOS DIAZ ELENA');
    await user.click(await within(grid).findByRole('button', { name: 'Agregar' }));
    const dialog = await picker();
    await user.click(await within(dialog).findByText('COMERCIAL LOS ANDES SAC'));
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(screen.queryByText('Buscar Cliente')).toBeNull());
    expect(state(grid, 'COMERCIAL LOS ANDES SAC')).toBe('Activo');
    expect(within(within(grid).getByText('COMERCIAL LOS ANDES SAC').closest('tr') as HTMLElement).getByText('20601234567')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect((await services.children('clientes').list('0000000002', 'sustitutos')).items.map((r) => r.id_hijo)).toEqual(['0000000001']));
    expect(((await services.catalog('clientes').get('0000000002')) as Record<string, unknown>).cant_sust).toBe(1);
  });
});
