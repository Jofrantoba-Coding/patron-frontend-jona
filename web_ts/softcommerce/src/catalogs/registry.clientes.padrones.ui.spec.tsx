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

/** The real `clientes` entry over the demo seed (user 7): cliente 1 has the padron 02 active (A Retencion), cliente 2 none (S-ANX-9..11, S-MD-8 on the real Cliente). */
function renderClientes(params: Record<string, unknown> = { IS_CLIENTE_SUSTITUTO: true, IS_CLIENTE_CREDITO: true }) {
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
const panel = () => screen.getByRole('tabpanel', { name: 'Padrones', hidden: true });
const dialog = () => screen.getByText('Nuevo: Agregar Padron').closest<HTMLElement>('[role="dialog"]') as HTMLElement;
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
const flag = (label: string) => (screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement).checked;

async function openUpdate(user: User, cliente: string) {
  await user.click(await screen.findByText(cliente));
  await user.click(screen.getByRole('button', { name: 'Modificar' }));
  await screen.findByLabelText('Tipo de Documento');
}
async function openPadrones(user: User, cliente = 'COMERCIAL LOS ANDES SAC') {
  await openUpdate(user, cliente);
  await user.click(screen.getByRole('tab', { name: 'Padrones' }));
  return panel();
}
async function activate(user: User, name: string) {
  await user.click(within(panel()).getByRole('button', { name: 'Activar' }));
  const form = await waitFor(() => dialog());
  await waitFor(() => expect(within(form).getByLabelText('Padron').querySelectorAll('option').length).toBeGreaterThan(1));
  await user.selectOptions(within(form).getByLabelText('Padron'), name);
  await user.click(within(form).getByRole('button', { name: 'Aceptar' }));
  await confirmLast(user);
  return form;
}
const retry = async (user: User, form: HTMLElement, name: string) => {
  await user.selectOptions(within(form).getByLabelText('Padron'), name);
  await user.click(within(form).getByRole('button', { name: 'Aceptar' }));
  await confirmLast(user);
};

describe('R-MST-10 the Padrones tab and the three flags of the Cliente', () => {
  it('the tab is always present, after the credit tabs and before Contactos', async () => {
    const { user } = renderClientes();
    await openUpdate(user, 'COMERCIAL LOS ANDES SAC');
    expect(within(screen.getByRole('dialog')).getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'General', 'Activación de Cliente', 'Direcciones', 'Sustitutos', 'Credito', 'Credito Temp', 'Padrones', 'Contactos', 'Cuentas',
    ]);
  });

  it('A Percepcion, A Retencion and Exceptuado are read-only and follow the active padron rows', async () => {
    const { user } = renderClientes();
    await openUpdate(user, 'COMERCIAL LOS ANDES SAC');
    expect([flag('A Percepcion'), flag('A Retencion'), flag('Exceptuado')]).toEqual([false, true, false]);
    expect((screen.getByLabelText('A Retencion', { selector: 'input' }) as HTMLInputElement).disabled).toBe(true);
  });

  it('the list shows AP, AR and EX (Sí / No) after DIRECCION', async () => {
    renderClientes();
    await screen.findByText('COMERCIAL LOS ANDES SAC');
    const headers = screen.getAllByRole('columnheader').map((h) => h.textContent);
    const from = headers.indexOf('AP');
    expect(headers.slice(from - 1, from + 3)).toEqual(['DIRECCION', 'AP', 'AR', 'EX']);
    const cells = within(screen.getByText('COMERCIAL LOS ANDES SAC').closest('tr') as HTMLElement).getAllByRole('cell').map((cell) => cell.textContent);
    expect(cells.slice(from, from + 3)).toEqual(['No', 'Sí', 'No']);
  });
});

describe('S-ANX-10 / S-ANX-9 Activar on the Cliente', () => {
  it('offers EXCEPTUADO, AG. RETENCION and AG. PERCEPCION and no BUEN CONTRIBUYENTE', async () => {
    const { user } = renderClientes();
    await openPadrones(user, 'RAMOS DIAZ ELENA');
    await user.click(within(panel()).getByRole('button', { name: 'Activar' }));
    const form = await waitFor(() => dialog());
    await waitFor(() => expect(within(form).getByLabelText('Padron').querySelectorAll('option').length).toBeGreaterThan(1));
    expect(within(within(form).getByLabelText('Padron')).getAllByRole('option').map((o) => o.textContent).slice(1)).toEqual(['EXCEPTUADO', 'AG. RETENCION', 'AG. PERCEPCION']);
  });

  it('01 over the active 02 says the incompatibility sentence, the same 02 says it is already active; 03 is accepted and checks A Percepcion', async () => {
    const { user } = renderClientes();
    await openPadrones(user);
    await within(panel()).findByText('AG. RETENCION');
    let form = await activate(user, 'EXCEPTUADO');
    expect(await within(form).findByText('Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion')).toBeTruthy();
    await retry(user, form, 'AG. RETENCION');
    expect(await within(form).findByText('Padron ya se Encuentra Activado')).toBeTruthy();
    await retry(user, form, 'AG. PERCEPCION');
    await waitFor(() => expect(within(panel()).getByText('AG. PERCEPCION')).toBeTruthy());
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect([flag('A Percepcion'), flag('A Retencion')]).toEqual([true, true]);
  });

  it('02 over an active 01 says Desactive Exceptuado', async () => {
    const { user } = renderClientes();
    await openPadrones(user, 'RAMOS DIAZ ELENA');
    await activate(user, 'EXCEPTUADO');
    await waitFor(() => expect(within(panel()).getByText('EXCEPTUADO')).toBeTruthy());
    const form = await activate(user, 'AG. RETENCION');
    expect(await within(form).findByText('Configuracion incompatible, Desactive Exceptuado')).toBeTruthy();
  });
});

describe('S-ANX-11 Desactivar on the Cliente', () => {
  it('asks Desea Desactivar Padron?, closes the row and unchecks A Retencion; a closed row says it is already deactivated', async () => {
    const { user } = renderClientes();
    const grid = await openPadrones(user);
    await user.click(await within(grid).findByText('AG. RETENCION'));
    await user.click(within(grid).getByRole('button', { name: 'Desactivar' }));
    expect(await screen.findByText('Desea Desactivar Padron?')).toBeTruthy();
    await confirmLast(user);
    await waitFor(() => expect(within(within(grid).getByText('AG. RETENCION').closest('tr') as HTMLElement).getByRole('img').getAttribute('aria-label')).toBe('Desactivado'));
    await user.click(within(grid).getByText('AG. RETENCION'));
    await user.click(within(grid).getByRole('button', { name: 'Desactivar' }));
    expect(within(grid).getByRole('status').textContent).toBe('Padron Seleccionado ya esta desactivado');
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect(flag('A Retencion')).toBe(false);
  });
});

describe('S-MD-8 a padron the server refuses', () => {
  it('keeps the register open with its pending rows, shows the sentence on the row and goes to the Padrones tab; nothing is saved', async () => {
    const { user, services } = renderClientes();
    await openPadrones(user, 'RAMOS DIAZ ELENA');
    // Another session activates 01 after this register loaded its grid: the register cannot know, the server refuses 02.
    await services.catalog('clientes').update('0000000002', { children: { padrones: [{ op: 'I', id_padron: '01', f_inicio: '2026-03-01' }] } });
    await activate(user, 'AG. RETENCION');
    await waitFor(() => expect(within(panel()).getByText('AG. RETENCION')).toBeTruthy());
    await user.click(screen.getByRole('tab', { name: 'General' }));
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    expect((await within(panel()).findByRole('alert')).textContent).toBe('AG. RETENCION: Configuracion incompatible, Desactive Exceptuado');
    expect(screen.getByRole('tab', { name: 'Padrones' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(within(panel()).getByText('AG. RETENCION')).toBeTruthy();
    expect(((await services.catalog('clientes').get('0000000002')) as Record<string, unknown>).flag_retencion).toBe(false);
  });
});
