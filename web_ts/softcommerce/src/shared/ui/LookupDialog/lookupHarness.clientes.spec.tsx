import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ServicesProvider } from '../../../services/ServicesContext';
import { createAppServicesMock } from '../../../services/mock/AppServicesMock';
import { seed } from '../../../services/mock/seed';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import { LookupHarness } from './lookupHarness';

/** BuscarCliente and FormClienteBuscar over the real `clientes` entry and seed (in-browser mock), through the harness host (R-LKP-7, S-LKP-1 shape over clientes). */
function renderHarness() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7' }), delayMs: 0, seed });
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
const open = async (user: ReturnType<typeof userEvent.setup>, picker: string) => {
  await user.click(screen.getByRole('button', { name: picker }));
  return screen.findByRole('dialog');
};

describe('BuscarCliente harness (S-LKP-1 over clientes)', () => {
  it('lists the three active clientes with their code, razon social, RUC/DNI, direccion and CANT SUST, and none is picked', async () => {
    const user = renderHarness();
    const dialog = await open(user, 'buscarCliente');
    await waitFor(() => expect(rows(dialog)).toHaveLength(3));
    expect(rows(dialog).map((r) => [r[0], r[1], r[2], r.at(-1)])).toEqual([
      ['0000000001', 'COMERCIAL LOS ANDES SAC', '20601234567', '1'],
      ['0000000002', 'RAMOS DIAZ ELENA', '45678912', '0'],
      ['0000000003', 'KIM TRADING', '001234999', '0'],
    ]);
    expect(within(dialog).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['COD', 'RAZON SOCIAL', 'RUC/DNI', 'DIRECCION', 'AR', 'EX', 'CANT SUST']);
    expect(within(dialog).getByRole('button', { name: 'Agregar' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('a pick hands the full row to the host and closes the dialog', async () => {
    const user = renderHarness();
    const dialog = await open(user, 'buscarCliente');
    await user.click(await within(dialog).findByText('RAMOS DIAZ ELENA'));
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('"id_cliente":"0000000002"'));
    expect(screen.getByRole('status').textContent).toContain('"numero_doc":"45678912"');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('the Clasificación select filters on the exact tipo de cliente: the three seeded clientes are all tipo 1, so they stay', async () => {
    const user = renderHarness();
    const dialog = await open(user, 'buscarCliente');
    await waitFor(() => expect(rows(dialog)).toHaveLength(3));
    await waitFor(() => expect(within(dialog).getByLabelText('Clasificación').querySelectorAll('option').length).toBeGreaterThan(1));
    await user.selectOptions(within(dialog).getByLabelText('Clasificación'), (within(dialog).getByLabelText('Clasificación') as HTMLSelectElement).options[1].textContent as string);
    await waitFor(() => expect(rows(dialog)).toHaveLength(3));
  });
});

describe('FormClienteBuscar harness (S-LKP-1 over clientes)', () => {
  it('opens as Buscar Cliente and lists the clientes with estado A only, with the flags, CANT_SUST and the condicion de pago', async () => {
    const user = renderHarness();
    const dialog = await open(user, 'formClienteBuscar');
    expect(within(dialog).getByText('Buscar Cliente')).toBeTruthy();
    await waitFor(() => expect(rows(dialog)).toHaveLength(2));
    expect(rows(dialog).map((r) => [r[0], r[1]])).toEqual([['0000000001', 'COMERCIAL LOS ANDES SAC'], ['0000000002', 'RAMOS DIAZ ELENA']]);
    expect(within(dialog).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['COD', 'RAZON SOCIAL', 'RUC/DNI', 'DIRECCION', 'AP', 'AR', 'EX', 'CANT_SUST', 'CONDICION PAGO', 'NUMERO DIAS']);
    expect(rows(dialog)[0].slice(7)).toEqual(['1', 'CREDITO', '30']);
  });

  it('a pick hands the row to the host', async () => {
    const user = renderHarness();
    const dialog = await open(user, 'formClienteBuscar');
    await user.click(await within(dialog).findByText('COMERCIAL LOS ANDES SAC'));
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('"id_cliente":"0000000001"'));
  });
});
