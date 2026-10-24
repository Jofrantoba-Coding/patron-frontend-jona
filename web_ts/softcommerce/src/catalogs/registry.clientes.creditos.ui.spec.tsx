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

/** The real `clientes` entry over the demo seed (user 7) with the session params given (S-MST-25 on the real Cliente). */
function renderClientes(params: Record<string, unknown> = { IS_CLIENTE_CREDITO: true }) {
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
const childDialog = (tab: string) => screen.getByText(`Nuevo: ${tab}`).closest<HTMLElement>('[role="dialog"]') as HTMLElement;
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
const total = (label: string) => screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;
const retype = async (user: User, dialog: HTMLElement, label: string, digits: string) => {
  const input = within(dialog).getByLabelText(label);
  await user.clear(input);
  await user.type(input, digits);
};

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

describe('R-MST-12 the credit tabs are behind IS_CLIENTE_CREDITO', () => {
  it('show after the Sustitutos position, with the two totals read-only on General', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    expect(within(screen.getByRole('dialog')).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['General', 'Activación de Cliente', 'Direcciones', 'Credito', 'Credito Temp', 'Contactos', 'Cuentas']);
    await waitFor(() => expect([total('Credito').value, total('Credito Temp').value]).toEqual(['5000', '1200']));
    expect([total('Credito').readOnly, total('Credito Temp').readOnly]).toEqual([true, true]);
  });

  it('with the parameter false there are no credit tabs and no totals', async () => {
    const { user } = renderClientes({ IS_CLIENTE_CREDITO: false });
    await openUpdate(user);
    expect(screen.queryByRole('tab', { name: 'Credito' })).toBeNull();
    expect(screen.queryByLabelText('Credito', { selector: 'input' })).toBeNull();
  });

  it('a new Cliente shows both totals as 0', async () => {
    const { user } = renderClientes();
    await user.click(await screen.findByRole('button', { name: 'Agregar' }));
    await screen.findByLabelText('Tipo de Documento');
    expect([total('Credito').value, total('Credito Temp').value]).toEqual(['0', '0']);
  });
});

describe('S-MST-25 the Credito dialog', () => {
  it('asks Motivo then Monto; a credit AMPLIACION of 1500 makes the total the previous sum plus 1500, and the save sends it', async () => {
    const { user, services } = renderClientes();
    await openUpdate(user);
    await waitFor(() => expect(total('Credito').value).toBe('5000'));
    const dialog = await openDialog(user, 'Credito');
    expect(within(dialog).queryByLabelText('F Fin')).toBeNull();
    await accept(user, dialog);
    expect(await within(dialog).findByText('Ingrese Motivo')).toBeTruthy();
    await user.type(within(dialog).getByLabelText('Motivo'), 'ampliacion');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Ingrese Monto')).toBeTruthy();
    await user.type(within(dialog).getByLabelText('Monto'), '1500');
    await accept(user, dialog);
    await confirmLast(user);
    await waitFor(() => expect(within(panel('Credito')).getByText('AMPLIACION')).toBeTruthy());
    expect(total('Credito').value).toBe('6500');
    expect(total('Credito Temp').value).toBe('1200');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect(((await services.catalog('clientes').get('0000000001')) as Record<string, unknown>).credito).toBe(6500));
  });

  it('there is no Quitar and no Desactivar on a credit grid (the rows are additive)', async () => {
    const { user } = renderClientes();
    await openUpdate(user);
    await user.click(screen.getByRole('tab', { name: 'Credito' }));
    const grid = panel('Credito');
    await within(grid).findByText('LINEA INICIAL');
    expect(within(grid).queryByRole('button', { name: 'Quitar' })).toBeNull();
    expect(within(grid).queryByRole('button', { name: 'Desactivar' })).toBeNull();
    for (const header of ['MOTIVO', 'MONTO', 'F_INICIO']) expect(within(grid).getByText(header)).toBeTruthy();
  });
});

describe('S-MST-25 the Credito Temp dialog', () => {
  it('asks the F Fin, refuses a fin before the inicio inside the dialog, and stores the fin as entered', async () => {
    const { user, services } = renderClientes();
    await openUpdate(user);
    const dialog = await openDialog(user, 'Credito Temp');
    await user.type(within(dialog).getByLabelText('Motivo'), 'campana');
    await user.type(within(dialog).getByLabelText('Monto'), '300');
    await retype(user, dialog, 'F Inicio', '10032026');
    await retype(user, dialog, 'F Fin', '09032026');
    await accept(user, dialog);
    expect(await within(dialog).findByText('Fecha es menor a fecha inicial')).toBeTruthy();
    expect(total('Credito Temp').value).toBe('1200');
    await retype(user, dialog, 'F Fin', '20032026');
    await accept(user, dialog);
    await confirmLast(user);
    await waitFor(() => expect(total('Credito Temp').value).toBe('1500'));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect((await services.children('clientes').list('0000000001', 'creditos_temp')).items.at(-1)).toMatchObject({ f_inicio: '2026-03-10', f_fin: '2026-03-20', monto: 300 }));
  });
});
