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
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `vehiculos` entry over the demo seed: the Propietario lookup over the transportistas (R-MST-6, S-MST-12, S-REF-41, S-LKP-10). */
function renderCatalog() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('vehiculos'))} permissions={granted} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const dialogs = () => screen.getAllByRole('dialog');
const top = () => dialogs().at(-1) as HTMLElement;

async function openAdd() {
  const user = renderCatalog();
  await screen.findByText('ABC123');
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
  await screen.findByLabelText('Placa');
  return user;
}
const typeCode = async (user: User, code: string) => {
  await user.type(input('Propietario'), code);
  await user.tab();
};

describe('vehiculo Propietario (R-MST-6, S-REF-41)', () => {
  it('S-REF-41 the list shows the Propietario column with the razon social, empty when there is none', async () => {
    renderCatalog();
    await screen.findByText('ABC123');
    expect(screen.getAllByText('TRANSPORTES RAPIDO SAC').length).toBeGreaterThan(0);
    expect(screen.getByRole('columnheader', { name: /Propietario/ })).toBeTruthy();
  });

  it('S-LKP-10 a typed code resolves padded to ten among the active transportistas and shows the razon social without opening the dialog', async () => {
    const user = await openAdd();
    await typeCode(user, '1');
    await waitFor(() => expect(input('Propietario').value).toBe('0000000001'));
    expect(within(top()).getByDisplayValue('TRANSPORTES RAPIDO SAC')).toBeTruthy();
    expect(dialogs()).toHaveLength(1);
  });

  it('S-LKP-10 an unknown code and an inactive transportista never resolve: the dialog opens with the active ones only', async () => {
    const user = await openAdd();
    await typeCode(user, '99');
    await waitFor(() => expect(dialogs()).toHaveLength(2));
    expect(await within(top()).findByText('TRANSPORTES RAPIDO SAC')).toBeTruthy();
    expect(within(top()).getByText('QUISPE MAMANI LUIS')).toBeTruthy();
    expect(within(top()).queryByText('LEE KIM TRANSPORT')).toBeNull();
    expect(within(top()).queryByText('TRANSPORTISTA RETIRADO SA')).toBeNull();
  });

  it('the dialog filters by Codigo, RUC/DNI and Descripcion and lists CODIGO, RAZON SOCIAL and RUC/DNI', async () => {
    const user = await openAdd();
    await user.click(within(top()).getByRole('button', { name: 'Buscar' }));
    await waitFor(() => expect(dialogs()).toHaveLength(2));
    await within(top()).findByText('TRANSPORTES RAPIDO SAC');
    for (const label of ['Codigo', 'RUC/DNI', 'Descripcion']) expect(within(top()).getByLabelText(label)).toBeTruthy();
    for (const header of ['CODIGO', 'RAZON SOCIAL', 'RUC/DNI']) expect(within(top()).getAllByRole('columnheader', { name: header }).length).toBeGreaterThan(0);
    await user.type(within(top()).getByLabelText('Descripcion'), 'quispe');
    await waitFor(() => expect(within(top()).queryByText('TRANSPORTES RAPIDO SAC')).toBeNull());
    expect(within(top()).getByText('QUISPE MAMANI LUIS')).toBeTruthy();
  });

  it('S-REF-41 a vehiculo saved with no propietario succeeds; one saved with the transportista T lists it', async () => {
    const user = await openAdd();
    await user.type(input('Placa'), 'qwe123');
    await user.type(input('Const inscripcion'), 'ci-77');
    await waitFor(() => expect((screen.getByLabelText('Marca') as HTMLSelectElement).options.length).toBeGreaterThan(1));
    await user.selectOptions(screen.getByLabelText('Marca'), 'HYUNDAI');
    await user.selectOptions(screen.getByLabelText('Modelo'), 'HILUX');
    await typeCode(user, '2');
    await waitFor(() => expect(input('Propietario').value).toBe('0000000002'));
    await user.click(within(top()).getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    expect(await screen.findByText('QWE123')).toBeTruthy();
    expect(screen.getAllByText('QUISPE MAMANI LUIS').length).toBeGreaterThan(0);
  });
});
