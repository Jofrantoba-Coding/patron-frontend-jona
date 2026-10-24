import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CHILD_SEED, parentEntry } from '../../../mock-server/core/children.fixture';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { SessionProvider } from '../../session/SessionProvider';
import { createSessionStore, type Session } from '../../session/sessionStore';
import { ServicesProvider } from '../../services/ServicesContext';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiMasterRegister } from './UiMasterRegister';

/** S-REG-25 field half in the UI (R-REG-17): a field gated by a closed company parameter is absent from the register, not validated and not sent. */
const GATE = { param: 'IS_CLIENTE_CONDICION_PAGO' };
const base = parentEntry('clientes');
const registry = validateRegistry([
  {
    ...base,
    fields: [...base.fields, { name: 'condicion', kind: 'text', label: 'Condicion', max: 10, required: true, message: 'Seleccione Condicion', gate: GATE }],
    validation: ['nombre', 'condicion'],
  },
]);
const seed = (open: boolean) => ({ ...CHILD_SEED, params: { a: { INICIO_ACTIVIDADES: '2020-01-01', IS_CLIENTE_CONDICION_PAGO: open } } });

async function start(open: boolean) {
  const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'a' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry, seed: seed(open) });
  const store = createSessionStore(window.localStorage);
  store.setSession({ params: { IS_CLIENTE_CONDICION_PAGO: open } } as unknown as Session);
  const onDone = vi.fn();
  render(
    <SessionProvider store={store}>
      <ServicesProvider services={mock as any}>
        <DialogStackProvider>
          <UiMasterRegister config={toCatalogConfig(registry.bySlug.get('clientes'), registry) as any} service={mock.catalog('clientes')} mode="INSERT" onDone={onDone} onClose={vi.fn()} />
        </DialogStackProvider>
      </ServicesProvider>
    </SessionProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user: userEvent.setup(), mock, onDone };
}
const confirmLast = async (user: ReturnType<typeof userEvent.setup>) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);

describe('a field with a closed gate (S-REG-25)', () => {
  it('is absent from the register and is neither validated nor sent: the cliente saves without it', async () => {
    const { user, mock, onDone } = await start(false);
    expect(screen.queryByLabelText('Condicion')).toBeNull();
    await user.type(screen.getByLabelText('nombre'), 'NUEVO');
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(() => expect(onDone).toHaveBeenCalled());
    const saved = (await mock.catalog('clientes').get('004')) as Record<string, unknown>;
    expect([saved.nombre, saved.condicion]).toEqual(['NUEVO', undefined]);
  });

  it('with the gate open the field shows and is required with its sentence', async () => {
    const { user } = await start(true);
    expect(screen.getByLabelText('Condicion')).toBeTruthy();
    await user.type(screen.getByLabelText('nombre'), 'NUEVO');
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Seleccione Condicion')).toBeTruthy();
  });
});
