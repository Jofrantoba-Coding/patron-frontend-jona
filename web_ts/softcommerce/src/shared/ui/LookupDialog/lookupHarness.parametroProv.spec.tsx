import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ServicesProvider } from '../../../services/ServicesContext';
import { createAppServicesMock } from '../../../services/mock/AppServicesMock';
import { seed } from '../../../services/mock/seed';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import { LookupHarness } from './lookupHarness';

/** BuscarParametroProv over the real `parametros-prov` seed (in-browser mock), through the harness host (R-LKP-7, S-LKP-1 shape). It has no W3 consumer (W4 RegisterNotaDebito). */
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
  await user.click(screen.getByRole('button', { name: 'buscarParametroProv' }));
  return screen.findByRole('dialog');
};

describe('BuscarParametroProv harness (S-LKP-1 over parametros-prov)', () => {
  it('opens as Provisiones and lists the active parametros of tipo C with the desktop columns; the other tipo and the retired one are not offered', async () => {
    const user = renderHarness();
    const dialog = await open(user);
    expect(within(dialog).getByText('Provisiones')).toBeTruthy();
    await waitFor(() => expect(rows(dialog)).toHaveLength(2));
    expect(within(dialog).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['CODIGO', 'DESC PARAMETRO', 'CUENTA', 'COMPRA', 'VENTA', 'TESORERIA', 'FONDO FIJO']);
    expect(rows(dialog).map((r) => r.slice(0, 3))).toEqual([['1', 'IGV', '4011'], ['2', 'DETRACCION', '4012']]);
  });

  it('filters by Descripción, and a pick hands the full row to the host', async () => {
    const user = renderHarness();
    const dialog = await open(user);
    await waitFor(() => expect(rows(dialog)).toHaveLength(2));
    await user.type(within(dialog).getByLabelText('Descripción'), 'detra');
    await waitFor(() => expect(rows(dialog).map((r) => r[1])).toEqual(['DETRACCION']));
    await user.click(within(dialog).getByText('DETRACCION'));
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('"id_parametro_prov":"2"'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
