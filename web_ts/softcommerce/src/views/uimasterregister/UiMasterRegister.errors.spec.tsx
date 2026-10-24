import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CHILD_REGISTRY, CHILD_SEED } from '../../../mock-server/core/children.fixture';
import { toCatalogConfig } from '../../catalogs/registry';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiMasterRegister } from './UiMasterRegister';

const config = toCatalogConfig(CHILD_REGISTRY.bySlug.get('clientes'), CHILD_REGISTRY);
const mock = () => createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'a' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry: CHILD_REGISTRY, seed: CHILD_SEED });

/** The real mock catalog, but the sent child row at `index` has its direccion blanked on the way: the client validated it, the server does not accept it. */
function rejecting(index: number) {
  const services = mock();
  const real = services.catalog<Record<string, any>>('clientes');
  const service: InterCatalogService<Record<string, any>> = {
    ...real,
    create: (values) => {
      const direcciones = (values as any).children.direcciones.map((op: object, n: number) => (n === index ? { ...op, direccion: '' } : op));
      return real.create({ ...values, children: { direcciones } });
    },
  };
  return { services, service, real };
}

async function open(service: InterCatalogService<Record<string, any>>) {
  const onClose = vi.fn();
  const onDone = vi.fn();
  render(
    <DialogStackProvider>
      <UiMasterRegister config={config as any} service={service} mode="INSERT" onDone={onDone} onClose={onClose} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user: userEvent.setup(), onClose, onDone };
}
type User = ReturnType<typeof userEvent.setup>;
const panel = (name: string) => screen.getByRole('tabpanel', { name, hidden: true });
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
async function addDireccion(user: User, direccion: string) {
  await user.click(screen.getByRole('tab', { name: 'Direcciones' }));
  await user.click(within(panel('Direcciones')).getByRole('button', { name: 'Agregar' }));
  const dialog = await waitFor(() => screen.getByText('Nuevo: Direcciones').closest<HTMLElement>('[role="dialog"]') as HTMLElement);
  await user.type(within(dialog).getByLabelText('direccion'), direccion);
  await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
  await confirmLast(user);
}
async function submitFromGeneral(user: User) {
  await user.click(screen.getByRole('tab', { name: 'General' }));
  await user.click(screen.getByRole('button', { name: 'Aceptar' }));
  await confirmLast(user);
}

describe('UiMasterRegister server errors on children (S-MD-8, R-MD-5)', () => {
  it('S-MD-8: a rejected pending row keeps the dialog, the data and the rows, shows the error on its row, switches to its tab and persists no parent', async () => {
    const { service, real } = rejecting(0);
    const { user, onClose, onDone } = await open(service);
    await user.type(screen.getByLabelText('nombre'), 'nuevo');
    await addDireccion(user, 'av lima 1');
    await submitFromGeneral(user);
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Direcciones' }).getAttribute('aria-selected')).toBe('true'));
    expect(within(panel('Direcciones')).getByRole('alert').textContent).toMatch(/^av lima 1: /);
    expect(within(panel('Direcciones')).getAllByText('av lima 1').length).toBeGreaterThan(0);
    expect(onClose).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
    await user.click(screen.getByRole('tab', { name: 'General' }));
    expect((screen.getByLabelText('nombre') as HTMLInputElement).value).toBe('nuevo');
    expect((await real.list()).items.map((row) => row.nombre)).toEqual(['ACME', 'BETA']);
  });

  it('marks only the row whose index in the SENT array the server named', async () => {
    const { service } = rejecting(1);
    const { user } = await open(service);
    await user.type(screen.getByLabelText('nombre'), 'nuevo');
    await addDireccion(user, 'av lima 1');
    await addDireccion(user, 'jr cusco 2');
    await submitFromGeneral(user);
    const alert = await within(panel('Direcciones')).findByRole('alert');
    expect(alert.textContent).toMatch(/^jr cusco 2: /);
    expect(within(panel('Direcciones')).getAllByRole('alert')).toHaveLength(1);
  });
});
