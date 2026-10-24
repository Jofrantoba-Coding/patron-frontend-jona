import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CHILD_REGISTRY, CHILD_SEED, parentEntry } from '../../../mock-server/core/children.fixture';
import { GATE_REGISTRY, GATE_SEED } from '../../../mock-server/core/children.rules.fixture';
import { tinySeed } from '../../../mock-server/core/test-helpers';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { SessionProvider } from '../../session/SessionProvider';
import { createSessionStore, type Session } from '../../session/sessionStore';
import { ServicesProvider } from '../../services/ServicesContext';
import type { AppServices } from '../../services/serviceComposer';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiMasterRegister } from './UiMasterRegister';

const bancos = validateRegistry([
  parentEntry('bancos', {
    children: {
      activaciones: {
        tab: 'Activacion', removal: 'none', initial: { motivo: 'INICIO' },
        fields: [{ name: 'motivo', kind: 'text', label: 'motivo', max: 30 }], columns: [{ key: 'motivo', header: 'Motivo' }],
      },
    },
  }),
]);
const BANCOS_SEED = { ...tinySeed(), bancos: { a: [{ id_bancos: '001', nombre: 'BCP', activo: true, activaciones: [{ id: '1', motivo: 'UNO', estado: 'D' }, { id: '2', motivo: 'DOS', estado: 'D' }, { id: '3', motivo: 'TRES', estado: 'A' }] }] } };

type Setup = { registry: any; seed: any; slug: string; params?: Record<string, unknown> };
async function open(setup: Setup, mode: 'UPDATE' | 'DETAIL' | 'CLONE', id = '001') {
  const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'a' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry: setup.registry, seed: setup.seed });
  // Counts the child lists the register asks for.
  const list = vi.fn();
  const children = (catalog: string) => {
    const real = mock.children(catalog);
    return { ...real, list: (parentId: string, child: string, query?: object) => { list(child); return real.list(parentId, child, query); } };
  };
  const services = { ...mock, children } as unknown as AppServices;
  const store = createSessionStore(window.localStorage);
  store.setSession({ params: setup.params } as unknown as Session);
  const config = toCatalogConfig(setup.registry.bySlug.get(setup.slug), setup.registry);
  const onDone = vi.fn();
  render(
    <SessionProvider store={store}>
      <ServicesProvider services={services}>
        <DialogStackProvider>
          <UiMasterRegister config={config as any} service={mock.catalog(setup.slug)} mode={mode} id={id} onDone={onDone} onClose={vi.fn()} />
        </DialogStackProvider>
      </ServicesProvider>
    </SessionProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user: userEvent.setup(), mock, list, onDone };
}
const clientes: Setup = { registry: CHILD_REGISTRY, seed: CHILD_SEED, slug: 'clientes' };
const panel = (name: string) => screen.getByRole('tabpanel', { name, hidden: true });
const tab = (name: string) => screen.getByRole('tab', { name });
const confirmLast = async (user: ReturnType<typeof userEvent.setup>) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
const state = (row: string) => within(screen.getByText(row).closest('tr') as HTMLElement).getByRole('img').getAttribute('aria-label');

describe('UiMasterRegister restore (D11, R-MD-2)', () => {
  it('UPDATE loads the parent and every child at once, active and deactivated rows, never a deleted one', async () => {
    const { user, list } = await open(clientes, 'UPDATE');
    expect(list.mock.calls.map(([child]) => child).sort()).toEqual(['contactos', 'direcciones']);
    await user.click(tab('Direcciones'));
    expect(state('AV 1')).toBe('Activo');
    expect(state('AV 2')).toBe('Desactivado');
    expect(screen.queryByText('AV 3')).toBeNull();
    await user.click(tab('Contactos'));
    expect(within(panel('Contactos')).getAllByText('ANA')).toHaveLength(1);
  });

  it('DETAIL shows the persisted rows with the toolbar disabled and a loaded record alone is no change', async () => {
    const { user, onDone } = await open(clientes, 'DETAIL');
    await user.click(tab('Direcciones'));
    expect(within(panel('Direcciones')).getByText('AV 1')).toBeTruthy();
    expect((within(panel('Direcciones')).getByRole('button', { name: 'Quitar' }) as HTMLButtonElement).disabled).toBe(true);
    expect(onDone).not.toHaveBeenCalled();
  });

  it('S-MD-6: a persisted direccion turns deactivated and stays, the same row again says so and a persisted contacto leaves; both are sent on save', async () => {
    const { user, mock } = await open(clientes, 'UPDATE');
    await user.click(tab('Direcciones'));
    await user.click(screen.getByText('AV 1'));
    await user.click(within(panel('Direcciones')).getByRole('button', { name: 'Quitar' }));
    await waitFor(() => expect(state('AV 1')).toBe('Desactivado'));
    await user.click(screen.getByText('AV 1'));
    await user.click(within(panel('Direcciones')).getByRole('button', { name: 'Quitar' }));
    expect(within(panel('Direcciones')).getByRole('status').textContent).toBe('Fila ya Esta desactivada');
    await user.click(tab('Contactos'));
    await user.click(within(panel('Contactos')).getByText('ANA'));
    await user.click(within(panel('Contactos')).getByRole('button', { name: 'Quitar' }));
    await waitFor(() => expect(within(panel('Contactos')).queryByText('ANA')).toBeNull());
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    const kids = mock.children('clientes');
    await waitFor(async () => expect((await kids.list('001', 'direcciones')).items.map((r: any) => [r.id, r.estado])).toEqual([['1', 'D'], ['2', 'D']]));
    expect((await kids.list('001', 'contactos')).items).toEqual([]);
  });

  it('S-MD-12: CLONE of a Banco with three activation rows loads none of them and the server creates the one initial INICIO', async () => {
    const { user, mock, list } = await open({ registry: bancos, seed: BANCOS_SEED, slug: 'bancos' }, 'CLONE');
    expect(list).not.toHaveBeenCalled();
    await user.click(tab('Activacion'));
    expect(within(panel('Activacion')).queryByText('UNO')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect((await mock.children('bancos').list('002', 'activaciones')).items.map((r: any) => r.motivo)).toEqual(['INICIO']));
    expect((await mock.children('bancos').list('001', 'activaciones')).items).toHaveLength(3);
  });
});

describe('UiMasterRegister param-gated tabs (S-MD-14, S-REG-25)', () => {
  const gated = (params: Record<string, unknown>): Setup => ({ registry: GATE_REGISTRY, seed: GATE_SEED, slug: 'clientes', params });

  it('S-MD-14: a closed gate leaves the tab out, not hidden, and never asks the server for its rows', async () => {
    const { list } = await open(gated({ IS_CLIENTE_SUSTITUTO: false, ISBOTICA: false }), 'UPDATE');
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['General', 'Avisos']);
    expect(screen.queryByRole('tabpanel', { name: 'Sustitutos', hidden: true })).toBeNull();
    expect(list.mock.calls.map(([child]) => child)).toEqual(['avisos']);
  });

  it('S-MD-14: an open gate shows the tab, and a value gate follows the parameter value', async () => {
    const { list } = await open(gated({ IS_CLIENTE_SUSTITUTO: true, ISBOTICA: true }), 'UPDATE');
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['General', 'Sustitutos']);
    expect(list.mock.calls.map(([child]) => child)).toEqual(['sustitutos']);
  });
});
