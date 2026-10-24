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
import { formRegistry } from '../views/uishell/formRegistry';
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `proveedores` entry over the demo seed (user 7), against the in-browser mock (S-MST-1, S-MST-3, S-MST-26, S-ANX-9..12 for the Proveedor). */
function renderProveedores() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('proveedores'), REGISTRY)} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return { user: userEvent.setup(), services };
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const selected = (label: string) => select(label).selectedOptions[0]?.textContent;
const dialog = () => screen.getByRole('dialog');
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);

async function openRegister(user: User, button: 'Agregar' | 'Modificar', row?: string) {
  if (row) await user.click(await screen.findByText(row));
  else await screen.findByText('DISTRIBUIDORA ANDINA SAC');
  await user.click(screen.getByRole('button', { name: button }));
  await screen.findByLabelText('Tipo de Documento');
  await waitFor(() => expect(selected('Nacionalidad')).toBeTruthy());
}

describe('R-REG-19 the screen is reachable', () => {
  it('the menu leaf miProveedor opens the generic catalog unit', () => {
    expect(formRegistry.miProveedor).toBeTruthy();
  });
});

describe('proveedores list and toolbar (S-MST-1)', () => {
  it('lists the active proveedores with the desktop columns, hides the retired one, and offers add and modify only', async () => {
    renderProveedores();
    expect(await screen.findByText('DISTRIBUIDORA ANDINA SAC')).toBeTruthy();
    expect(screen.queryByText('PROVEEDOR RETIRADO SA')).toBeNull();
    for (const header of ['T_PERSONA', 'RAZON SOCIAL', 'PATERNO', 'MATERNO', 'NOMBRES', 'RUC/DNI', 'DIRECCION']) expect(screen.getByText(header)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Modificar' })).toBeTruthy();
    for (const name of ['Eliminar', 'Clonar', 'Detalle']) expect(screen.queryByRole('button', { name })).toBeNull();
  });
});

describe('proveedores INSERT (S-MST-2, S-MST-3, S-MST-26)', () => {
  it('opens with no tipo selected and PERUANA', async () => {
    const { user } = renderProveedores();
    await openRegister(user, 'Agregar');
    expect(selected('Tipo de Documento')).toBe('--- Seleccione ---');
    expect(selected('Nacionalidad')).toBe('PERUANA');
  });

  it('S-MST-3 no tipo says "un Proveedor"', async () => {
    const { user } = renderProveedores();
    await openRegister(user, 'Agregar');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un Proveedor, debes Seleccionar un Tipo de Documento.')).toBeTruthy();
  });

  it('S-MST-26 the tabs are General, Activación de Proveedor and Padrones: no address grid and no padron configuration', async () => {
    const { user } = renderProveedores();
    await openRegister(user, 'Agregar');
    expect(within(dialog()).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['General', 'Activación de Proveedor', 'Padrones']);
    await user.click(screen.getByRole('tab', { name: 'Activación de Proveedor' }));
    expect(within(screen.getByRole('tabpanel', { name: 'Activación de Proveedor' })).getByText('INICIO')).toBeTruthy();
  });

  it('the three padron flags show read-only and unchecked', async () => {
    const { user } = renderProveedores();
    await openRegister(user, 'Agregar');
    for (const label of ['A Percepcion', 'A Retencion', 'Buen Contribuyente']) {
      const box = screen.getByLabelText(label) as HTMLInputElement;
      expect([box.checked, box.disabled]).toEqual([false, true]);
    }
  });
});

describe('proveedores UPDATE: the Padrones tab (S-ANX-10, S-ANX-12)', () => {
  it('shows the stored padron and its flag, and the offer is 02, 03, 04', async () => {
    const { user } = renderProveedores();
    await openRegister(user, 'Modificar', 'DISTRIBUIDORA ANDINA SAC');
    await waitFor(() => expect((screen.getByLabelText('A Retencion') as HTMLInputElement).checked).toBe(true));
    await user.click(screen.getByRole('tab', { name: 'Padrones' }));
    const panel = screen.getByRole('tabpanel', { name: 'Padrones' });
    expect(await within(panel).findByText('AG. RETENCION')).toBeTruthy();
    await user.click(within(panel).getByRole('button', { name: 'Activar' }));
    const form = await waitFor(() => screen.getByText('Nuevo: Agregar Padron').closest<HTMLElement>('[role="dialog"]') as HTMLElement);
    await waitFor(() => expect(within(form).getByLabelText('Padron').querySelectorAll('option').length).toBe(4));
    expect([...within(form).getByLabelText('Padron').querySelectorAll('option')].map((o) => o.textContent)).toEqual(['--- Seleccione ---', 'AG. RETENCION', 'AG. PERCEPCION', 'BUEN CONTRIBUYENTE']);
  });

  it('S-ANX-12 activating 04 then saving stores the row and checks Buen Contribuyente, not A Percepcion', async () => {
    const { user, services } = renderProveedores();
    await openRegister(user, 'Modificar', 'DISTRIBUIDORA ANDINA SAC');
    await user.click(screen.getByRole('tab', { name: 'Padrones' }));
    const panel = screen.getByRole('tabpanel', { name: 'Padrones' });
    await user.click(within(panel).getByRole('button', { name: 'Activar' }));
    const form = await waitFor(() => screen.getByText('Nuevo: Agregar Padron').closest<HTMLElement>('[role="dialog"]') as HTMLElement);
    await waitFor(() => expect(within(form).getByLabelText('Padron').querySelectorAll('option').length).toBe(4));
    await user.selectOptions(within(form).getByLabelText('Padron'), '04');
    await user.click(within(form).getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect([(screen.getByLabelText('Buen Contribuyente') as HTMLInputElement).checked, (screen.getByLabelText('A Percepcion') as HTMLInputElement).checked]).toEqual([true, false]);
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect(((await services.catalog('proveedores').get('0000000001')) as Record<string, unknown>).flag_buen_contrib).toBe(true));
    expect(((await services.catalog('proveedores').get('0000000001')) as Record<string, unknown>).flag_percepcion).toBe(false);
  });
});
