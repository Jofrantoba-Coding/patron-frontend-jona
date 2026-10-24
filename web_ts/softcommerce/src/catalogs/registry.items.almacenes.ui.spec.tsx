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
const TAB = 'Configuracion Almacen';

/** The real `items` entry over the demo seed (user 7, empresa 1) against the in-browser mock: the `Configuracion Almacen` tab (S-MST-30, S-MD-9, S-MD-6, S-MST-32). */
function renderItems() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  const store = createSessionStore(window.localStorage);
  store.setSession({ params: { IS_ITEM_RESUMEN_PRECIO: true, ISBOTICA: false, IS_BOTICA_SIN_LOTE: false, PORC_IGV: 18 } } as unknown as Session);
  render(
    <SessionProvider store={store}>
      <ServicesProvider services={services}>
        <DialogStackProvider>
          <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('items'), REGISTRY)} permissions={granted} />
        </DialogStackProvider>
      </ServicesProvider>
    </SessionProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const panel = () => screen.getByRole('tabpanel', { name: TAB, hidden: true });
const dialogOf = () => screen.getByText(`Nuevo: ${TAB}`).closest<HTMLElement>('[role="dialog"]') as HTMLElement;
const options = (root: HTMLElement, label: string) => [...(within(root).getByLabelText(label) as HTMLSelectElement).options].map((o) => o.textContent);
const state = (root: HTMLElement, row: string) => within(within(root).getByText(row).closest('tr') as HTMLElement).getByRole('img').getAttribute('aria-label');
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
const choose = async (user: User, dialog: HTMLElement, label: string, text: string) => {
  await waitFor(() => expect(options(dialog, label)).toContain(text));
  await user.selectOptions(within(dialog).getByLabelText(label), text);
};
const accept = (user: User, dialog: HTMLElement) => user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));

async function openUpdate(user: User, row = 'MANZANA ROJA X KG') {
  await user.click(await screen.findByText(row));
  await user.click(screen.getByRole('button', { name: 'Modificar' }));
  await screen.findByLabelText('Cod. Alterno');
}
async function openDialog(user: User) {
  await user.click(screen.getByRole('tab', { name: TAB }));
  await user.click(within(panel()).getByRole('button', { name: 'Agregar' }));
  return waitFor(dialogOf);
}

describe('S-MST-32 the tabs of the Item register', () => {
  it('are Datos de Item and Configuracion Almacen and nothing of the deferred tabs, with no units or prices grid', async () => {
    const user = renderItems();
    await openUpdate(user);
    expect(within(screen.getByRole('dialog')).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Datos de Item', TAB]);
  });
});

describe('S-MD-3 the Almacenes grid restores the rows of the real Item on UPDATE and DETAIL', () => {
  it('lists the active and the deactivated row with the desktop columns and not the deleted one', async () => {
    const user = renderItems();
    await openUpdate(user);
    await user.click(screen.getByRole('tab', { name: TAB }));
    const grid = panel();
    await within(grid).findByText('DESPACHO');
    for (const header of ['ALMACEN', 'F_INICIO', 'F_FIN', 'PROCESO']) expect(within(grid).getByText(header)).toBeTruthy();
    expect(within(grid).getAllByText('ALMACEN CENTRAL')).toHaveLength(2);
    expect(within(grid).getAllByRole('img').map((img) => img.getAttribute('aria-label'))).toEqual(['Activo', 'Desactivado']);
    expect(within(grid).queryByText('ALMACEN ATE')).toBeNull();
  });

  it('shows the same rows on DETAIL, read-only', async () => {
    const user = renderItems();
    await user.click(await screen.findByText('MANZANA ROJA X KG'));
    await user.click(screen.getByRole('button', { name: 'Detalle' }));
    await user.click(await screen.findByRole('tab', { name: TAB }));
    await within(panel()).findByText('DESPACHO');
    expect((within(panel()).getByRole('button', { name: 'Agregar' }) as HTMLButtonElement).disabled).toBe(true);
    expect((within(panel()).getByRole('button', { name: 'Quitar' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('S-MST-30 the Almacen dialog', () => {
  it('offers the localidades of the session empresa, then the punto de venta and the almacen of the chain, and VENTA / DESPACHO', async () => {
    const user = renderItems();
    await openUpdate(user);
    const dialog = await openDialog(user);
    await waitFor(() => expect(options(dialog, 'Localidad')).toContain('LOCAL ATE'));
    expect(options(dialog, 'Localidad')).toEqual(['--- Seleccione ---', 'LOCAL CENTRAL', 'LOCAL ATE']);
    expect(options(dialog, 'Proceso')).toEqual(['Seleccione', 'VENTA', 'DESPACHO']);
    expect((within(dialog).getByLabelText('Proceso') as HTMLSelectElement).value).toBe('VENTA');
    await choose(user, dialog, 'Localidad', 'LOCAL ATE');
    await waitFor(() => expect(options(dialog, 'Pto Venta')).toContain('TIENDA MIRAFLORES'));
    await choose(user, dialog, 'Pto Venta', 'TIENDA MIRAFLORES');
    await waitFor(() => expect(options(dialog, 'Almacen')).toEqual(['--- Seleccione ---', 'ALMACEN ATE']));
  });

  it('says Seleccione Localidad, Punto de Venta, Almacen in order and adds the row with the confirm', async () => {
    const user = renderItems();
    await openUpdate(user);
    const dialog = await openDialog(user);
    await accept(user, dialog);
    expect(await within(dialog).findByText('Seleccione Localidad')).toBeTruthy();
    await choose(user, dialog, 'Localidad', 'LOCAL ATE');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Seleccione Punto de Venta')).toBeTruthy();
    await choose(user, dialog, 'Pto Venta', 'TIENDA MIRAFLORES');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Seleccione Almacen')).toBeTruthy();
    await choose(user, dialog, 'Almacen', 'ALMACEN ATE');
    await accept(user, dialog);
    await confirmLast(user);
    await waitFor(() => expect(within(panel()).getByText('ALMACEN ATE')).toBeTruthy());
  });

  it('refuses an active almacen and proceso already in the grid with Almacen ya se Encuentra Activado and adds no row; the other proceso is accepted', async () => {
    const user = renderItems();
    await openUpdate(user);
    await user.click(screen.getByRole('tab', { name: TAB }));
    await within(panel()).findByText('DESPACHO');
    const rows = () => within(panel()).getAllByText('ALMACEN CENTRAL').length;
    const dialog = await openDialog(user);
    await choose(user, dialog, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, dialog, 'Pto Venta', 'TIENDA CENTRAL');
    await choose(user, dialog, 'Almacen', 'ALMACEN CENTRAL');
    await accept(user, dialog);
    await confirmLast(user);
    expect(await within(dialog).findByText('Almacen ya se Encuentra Activado')).toBeTruthy();
    expect(rows()).toBe(2);
    await user.selectOptions(within(dialog).getByLabelText('Proceso'), 'DESPACHO');
    await accept(user, dialog);
    await confirmLast(user);
    await waitFor(() => expect(rows()).toBe(3));
  });
});

describe('S-MD-6 / S-MD-9 Quitar on the Almacenes of the real Item', () => {
  it('says Seleccionar Fila, asks Desea Desactivar Almacen?, deactivates the row and refuses it the second time; the same pair is then accepted', async () => {
    const user = renderItems();
    await openUpdate(user);
    await user.click(screen.getByRole('tab', { name: TAB }));
    const grid = panel();
    await within(grid).findByText('DESPACHO');
    await user.click(within(grid).getByRole('button', { name: 'Quitar' }));
    expect(within(grid).getByRole('status').textContent).toBe('Seleccionar Fila');
    await user.click(within(grid).getByText('VENTA'));
    await user.click(within(grid).getByRole('button', { name: 'Quitar' }));
    expect(await screen.findByText('Desea Desactivar Almacen?')).toBeTruthy();
    await confirmLast(user);
    await waitFor(() => expect(state(grid, 'VENTA')).toBe('Desactivado'));
    await user.click(within(grid).getByText('VENTA'));
    await user.click(within(grid).getByRole('button', { name: 'Quitar' }));
    expect(within(grid).getByRole('status').textContent).toBe('Almacen Seleccionado ya esta desactivado');
    const dialog = await openDialog(user);
    await choose(user, dialog, 'Localidad', 'LOCAL CENTRAL');
    await choose(user, dialog, 'Pto Venta', 'TIENDA CENTRAL');
    await choose(user, dialog, 'Almacen', 'ALMACEN CENTRAL');
    await accept(user, dialog);
    await confirmLast(user);
    await waitFor(() => expect(within(grid).getAllByText('ALMACEN CENTRAL')).toHaveLength(3));
  });
});
