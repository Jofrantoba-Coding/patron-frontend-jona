import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { todayIso } from '../../mock-server/core/dates.js';
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

/** The real `bancos` entry over the demo seed (user 7), against the in-browser mock: the pilot of the anexo master (S-ANX-1, S-MST-3, S-MST-4, S-MD-12). */
function renderBancos() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('bancos'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const selected = (label: string) => select(label).selectedOptions[0]?.textContent;
const dialog = () => screen.getByRole('dialog');
const todayDisplay = () => {
  const [year, month, day] = todayIso().split('-');
  return `${day}/${month}/${year}`;
};
const historyRows = () => within(screen.getByRole('tabpanel', { name: 'Activación de Banco', hidden: true })).queryAllByRole('row').slice(1).map((tr) => within(tr).getAllByRole('cell').map((td) => td.textContent));

async function openRegister(user: User, button: 'Agregar' | 'Modificar' | 'Clonar', row?: string) {
  if (row) await user.click(await screen.findByText(row));
  else await screen.findByText('BANCO DE CREDITO DEL PERU');
  await user.click(screen.getByRole('button', { name: button }));
  await screen.findByLabelText('Tipo de Documento');
  await waitFor(() => expect(selected('Nacionalidad')).toBeTruthy());
}
const openHistory = (user: User) => user.click(screen.getByRole('tab', { name: 'Activación de Banco' }));

describe('R-REG-19 the screen is reachable', () => {
  it('the menu leaf miBancoAnexo opens the generic catalog unit', () => {
    expect(formRegistry.miBancoAnexo).toBeTruthy();
  });
});

describe('bancos list and toolbar (S-MST-1)', () => {
  it('lists the active bancos with their joined tipo and estado, hides the retired one, and offers no Eliminar', async () => {
    renderBancos();
    expect(await screen.findByText('BANCO DE CREDITO DEL PERU')).toBeTruthy();
    expect(screen.getByText('INTERBANK')).toBeTruthy();
    expect(screen.queryByText('BANCO RETIRADO SA')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).toBeNull();
    for (const name of ['Agregar', 'Modificar', 'Clonar']) expect(screen.getByRole('button', { name })).toBeTruthy();
  });
});

describe('bancos INSERT (R-MST-2, S-ANX-1, S-MST-3)', () => {
  it('opens on RUC and PERUANA with the razon social open and the sexo hidden', async () => {
    const user = renderBancos();
    await openRegister(user, 'Agregar');
    expect([selected('Tipo de Documento'), selected('Nacionalidad')]).toEqual(['RUC', 'PERUANA']);
    expect(screen.getByLabelText('Razón Social')).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'Masculino' })).toBeNull();
  });

  it('S-ANX-1 the Activación de Banco tab shows one active INICIO row of today, Activar and Desactivar disabled, and Estado checked', async () => {
    const user = renderBancos();
    await openRegister(user, 'Agregar');
    expect((screen.getByLabelText('Estado') as HTMLInputElement).checked).toBe(true);
    await openHistory(user);
    const [row] = historyRows();
    expect([row[0], row[1], row[2]]).toEqual(['●', 'INICIO', todayDisplay()]);
    expect(historyRows()).toHaveLength(1);
    const panel = screen.getByRole('tabpanel', { name: 'Activación de Banco' });
    expect(within(panel).getAllByRole('button').map((b) => [b.textContent, (b as HTMLButtonElement).disabled])).toEqual([['Activar', true], ['Desactivar', true]]);
  });

  it('S-MST-3 no tipo says "un Banco", not "un Cliente" [DEVIATION]', async () => {
    const user = renderBancos();
    await openRegister(user, 'Agregar');
    await user.selectOptions(select('Tipo de Documento'), '--- Seleccione ---');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un Banco, debes Seleccionar un Tipo de Documento.')).toBeTruthy();
  });
});

describe('bancos UPDATE and CLONE (S-MST-4, S-MD-12)', () => {
  it('S-MST-4 UPDATE of the banco with CE and EXTRANJERA restores both, not RUC / PERUANA [DEVIATION]', async () => {
    const user = renderBancos();
    await openRegister(user, 'Modificar', 'KIM LEE JAE');
    await waitFor(() => expect(selected('Nacionalidad')).toBe('EXTRANJERA'));
    expect(selected('Tipo de Documento')).toBe('CE');
    expect((screen.getByLabelText('Estado') as HTMLInputElement).checked).toBe(false);
    await openHistory(user);
    expect(historyRows().map((r) => [r[0], r[1], r[3]])).toEqual([['○', 'INICIO', 'CIERRE']]);
  });

  it('UPDATE of a banco with three activations lists them all, active and deactivated, in order', async () => {
    const user = renderBancos();
    await openRegister(user, 'Modificar', 'INTERBANK');
    await openHistory(user);
    await waitFor(() => expect(historyRows()).toHaveLength(3));
    expect(historyRows().map((r) => [r[0], r[1]])).toEqual([['○', 'INICIO'], ['○', 'REINGRESO'], ['●', 'REINGRESO']]);
  });

  it('S-MD-12 CLONE of a banco with three activations shows the one initial INICIO and none of the originals', async () => {
    const user = renderBancos();
    await openRegister(user, 'Clonar', 'INTERBANK');
    await openHistory(user);
    expect(historyRows().map((r) => [r[0], r[1]])).toEqual([['●', 'INICIO']]);
  });
});
