import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ServicesProvider } from '../../../services/ServicesContext';
import { createAppServicesMock } from '../../../services/mock/AppServicesMock';
import { seed } from '../../../services/mock/seed';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import { LookupHarness } from './lookupHarness';

/** FormBuscarVehiculo over the real `vehiculos` entry and seed (in-browser mock): the harness host has no production consumer until W4 (R-LKP-7, S-LKP-14). */
function renderHarness(presets?: Record<string, Record<string, string>>) {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <DialogStackProvider>
      <ServicesProvider services={services}>
        <LookupHarness presets={presets} />
      </ServicesProvider>
    </DialogStackProvider>,
  );
  return userEvent.setup();
}
const rows = (dialog: HTMLElement) => within(dialog).getAllByRole('row').slice(1).map((tr) => within(tr).getAllByRole('cell').map((td) => td.textContent));

describe('FormBuscarVehiculo harness (S-LKP-14, R-LKP-7)', () => {
  it('opens as Buscar Vehiculo with the desktop filters and lists the active vehiculos with their joined transportista, RUC, marca and modelo', async () => {
    const user = renderHarness();
    await user.click(screen.getByRole('button', { name: 'formBuscarVehiculo' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Buscar Vehiculo')).toBeTruthy();
    await waitFor(() => expect(rows(dialog)).toHaveLength(3));
    expect(rows(dialog).map((r) => r.slice(0, 5))).toEqual([
      ['001', 'TRANSPORTES RAPIDO SAC', '20123456789', 'ABC123', 'CI-0001'],
      ['002', 'TRANSPORTES RAPIDO SAC', '20123456789', 'XYZ789', 'CI-0002'],
      ['003', 'QUISPE MAMANI LUIS', '10456789012', 'DEF456', 'CI-0003'],
    ]);
  });

  it('S-LKP-14 a preset RUC shows in the RUC/DNI filter and only that transportista vehiculos load', async () => {
    const user = renderHarness({ formBuscarVehiculo: { transportista_ruc: '20123456789' } });
    await user.click(screen.getByRole('button', { name: 'formBuscarVehiculo' }));
    const dialog = await screen.findByRole('dialog');
    expect((within(dialog).getByLabelText('RUC/DNI') as HTMLInputElement).value).toBe('20123456789');
    await waitFor(() => expect(rows(dialog).map((r) => r[3])).toEqual(['ABC123', 'XYZ789']));
  });

  it('the Marca and Modelo selects filter on the exact key: a marca keeps only its vehiculos', async () => {
    const user = renderHarness();
    await user.click(screen.getByRole('button', { name: 'formBuscarVehiculo' }));
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(rows(dialog)).toHaveLength(3));
    await user.selectOptions(within(dialog).getByLabelText('Marca'), 'HYUNDAI');
    await waitFor(() => expect(rows(dialog).map((r) => r[3])).toEqual(['XYZ789']));
  });

  it('Refrescar clears the preset and reloads every vehiculo', async () => {
    const user = renderHarness({ formBuscarVehiculo: { transportista_ruc: '20123456789' } });
    await user.click(screen.getByRole('button', { name: 'formBuscarVehiculo' }));
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(rows(dialog)).toHaveLength(2));
    await user.click(within(dialog).getByRole('button', { name: 'Refrescar' }));
    await waitFor(() => expect(rows(dialog)).toHaveLength(3));
    expect((within(dialog).getByLabelText('RUC/DNI') as HTMLInputElement).value).toBe('');
  });
});
