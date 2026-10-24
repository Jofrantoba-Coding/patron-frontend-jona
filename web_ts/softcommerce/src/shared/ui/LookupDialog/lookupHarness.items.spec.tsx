import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ServicesProvider } from '../../../services/ServicesContext';
import { createAppServicesMock } from '../../../services/mock/AppServicesMock';
import { seed } from '../../../services/mock/seed';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import { LookupHarness } from './lookupHarness';

/** BuscarItemConversion over the real `items` entry and seed (in-browser mock, empresa 1), through the harness host (R-LKP-7, S-LKP-4 and S-LKP-13 over items). Its desktop consumer is the deferred `Conversion a Item` tab. */
function renderHarness() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <DialogStackProvider>
      <ServicesProvider services={services}>
        <LookupHarness />
      </ServicesProvider>
    </DialogStackProvider>,
  );
  return userEvent.setup();
}
const rows = (dialog: HTMLElement) => within(dialog).getAllByRole('row').slice(1).map((tr) => within(tr).getAllByRole('cell').map((td) => td.textContent));
const open = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'buscarItemConversion' }));
  return screen.findByRole('dialog');
};
const optionsOf = (dialog: HTMLElement, label: string) => [...(within(dialog).getByLabelText(label) as HTMLSelectElement).querySelectorAll('option')].map((o) => o.textContent);

describe('BuscarItemConversion harness (S-LKP-4, S-LKP-13 over items)', () => {
  it('opens as Item a convertir and lists the two active items with the real columns; the item with estado off is not offered', async () => {
    const user = renderHarness();
    const dialog = await open(user);
    expect(within(dialog).getByText('Item a convertir')).toBeTruthy();
    await waitFor(() => expect(rows(dialog)).toHaveLength(2));
    expect(within(dialog).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['COD', 'COD ALT', 'DESC', 'FAMILIA', 'SUB_FAMILIA', 'MARCA']);
    expect(rows(dialog)).toEqual([
      ['000001', 'ABA-001', 'MANZANA ROJA X KG', 'ABARROTES', 'FRUTAS', 'SONY'],
      ['000002', 'SRV-TRANS-01', 'SERVICIO DE TRANSPORTE', 'LIMPIEZA', 'DETERGENTES', 'SAMSUNG'],
    ]);
  });

  it('S-LKP-4 Familia and Marca filter the list; SubFamilia is disabled until a Familia is chosen and offers its subfamilias', async () => {
    const user = renderHarness();
    const dialog = await open(user);
    await waitFor(() => expect(rows(dialog)).toHaveLength(2));
    expect((within(dialog).getByLabelText('SubFamilia') as HTMLSelectElement).disabled).toBe(true);
    await user.selectOptions(within(dialog).getByLabelText('Familia'), 'ABARROTES');
    await waitFor(() => expect(optionsOf(dialog, 'SubFamilia')).toEqual(['--- Seleccione ---', 'FRUTAS', 'VERDURAS']));
    await waitFor(() => expect(rows(dialog).map((r) => r[2])).toEqual(['MANZANA ROJA X KG']));
    await user.selectOptions(within(dialog).getByLabelText('Marca'), 'SAMSUNG');
    await waitFor(() => expect(within(dialog).queryByText('MANZANA ROJA X KG')).toBeNull());
  });

  it('S-LKP-13 the conversion inputs open at 0.0, 0.0 and 1.0 and a pick hands the full item row to the host', async () => {
    const user = renderHarness();
    const dialog = await open(user);
    expect(['VALOR DE CONVERSION', 'VALOR DE PAQUETE', 'VALOR DE ORIGEN'].map((label) => (within(dialog).getByLabelText(label) as HTMLInputElement).value)).toEqual(['0.0', '0.0', '1.0']);
    await user.click(await within(dialog).findByText('SERVICIO DE TRANSPORTE'));
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('"id_item":"000002"'));
    expect(screen.getByRole('status').textContent).toContain('"id_alterno":"SRV-TRANS-01"');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
