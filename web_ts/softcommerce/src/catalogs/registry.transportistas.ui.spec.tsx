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

/** The real `transportistas` entry over the demo seed (user 7), against the in-browser mock (S-MST-1..3, S-MST-4 for the Transportista). */
function renderTransportistas() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('transportistas'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const selected = (label: string) => select(label).selectedOptions[0]?.textContent;
const dialog = () => screen.getByRole('dialog');

async function openRegister(user: User, button: 'Agregar' | 'Modificar' | 'Clonar', row?: string) {
  if (row) await user.click(await screen.findByText(row));
  else await screen.findByText('TRANSPORTES RAPIDO SAC');
  await user.click(screen.getByRole('button', { name: button }));
  await screen.findByLabelText('Tipo de Documento');
  await waitFor(() => expect(selected('Nacionalidad')).toBeTruthy());
}

describe('R-REG-19 the screen is reachable', () => {
  it('the menu leaf miTransportista opens the generic catalog unit', () => {
    expect(formRegistry.miTransportista).toBeTruthy();
  });
});

describe('transportistas list and toolbar (S-MST-1)', () => {
  it('lists the active transportistas, hides the retired one, and offers add, modify and clone but no Eliminar', async () => {
    renderTransportistas();
    expect(await screen.findByText('TRANSPORTES RAPIDO SAC')).toBeTruthy();
    expect(screen.queryByText('TRANSPORTISTA RETIRADO SA')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).toBeNull();
    for (const name of ['Agregar', 'Modificar', 'Clonar']) expect(screen.getByRole('button', { name })).toBeTruthy();
  });
});

describe('transportistas INSERT (S-MST-2, S-MST-3)', () => {
  it('S-MST-2 opens on RUC and PERUANA with the razon social open and the sexo hidden', async () => {
    const user = renderTransportistas();
    await openRegister(user, 'Agregar');
    expect([selected('Tipo de Documento'), selected('Nacionalidad')]).toEqual(['RUC', 'PERUANA']);
    expect(screen.getByLabelText('Razón Social')).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'Masculino' })).toBeNull();
  });

  it('S-MST-2 a RUC 2 makes the names read-only and a RUC 1 types them', async () => {
    const user = renderTransportistas();
    await openRegister(user, 'Agregar');
    await user.type(screen.getByLabelText('DNI/RUC'), '20123456789');
    expect((screen.getByLabelText('Nombres') as HTMLInputElement).readOnly).toBe(true);
    await user.clear(screen.getByLabelText('DNI/RUC'));
    await user.type(screen.getByLabelText('DNI/RUC'), '10123456789');
    expect((screen.getByLabelText('Nombres') as HTMLInputElement).readOnly).toBe(false);
  });

  it('S-MST-3 no tipo says "un Transportista", not "un Cliente" [DEVIATION]', async () => {
    const user = renderTransportistas();
    await openRegister(user, 'Agregar');
    await user.selectOptions(select('Tipo de Documento'), '--- Seleccione ---');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un Transportista, debes Seleccionar un Tipo de Documento.')).toBeTruthy();
  });

  it('shows the Activación de Transportista tab with the INICIO row', async () => {
    const user = renderTransportistas();
    await openRegister(user, 'Agregar');
    await user.click(screen.getByRole('tab', { name: 'Activación de Transportista' }));
    const panel = screen.getByRole('tabpanel', { name: 'Activación de Transportista' });
    expect(within(panel).getByText('INICIO')).toBeTruthy();
  });
});

describe('transportistas UPDATE (R-MST-2 [DEVIATION])', () => {
  it('restores the stored CE and EXTRANJERA, not RUC / PERUANA', async () => {
    const user = renderTransportistas();
    await openRegister(user, 'Modificar', 'LEE KIM TRANSPORT');
    await waitFor(() => expect(selected('Nacionalidad')).toBe('EXTRANJERA'));
    expect(selected('Tipo de Documento')).toBe('CE');
  });
});
