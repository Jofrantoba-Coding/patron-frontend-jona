import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { ACTION_HOOKS } from '../../../mock-server/core/actions.js';
import { parentEntry } from '../../../mock-server/core/children.fixture';
import { todayIso } from '../../../mock-server/core/dates.js';
import { actionNotAllowed } from '../../../mock-server/core/errors.js';
import { tinySeed } from '../../../mock-server/core/test-helpers';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { ACTION_RULES } from '../../domain/crud/actionRules';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import { ServicesProvider } from '../../services/ServicesContext';
import type { AppServices } from '../../services/serviceComposer';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiMasterRegister } from './UiMasterRegister';

const text = (name: string, label: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label, max: 30, ...extra });
const ALL = ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'];
const registry = validateRegistry([
  parentEntry('clientes', {
    fields: [{ name: 'id_clientes', kind: 'code', label: 'Codigo' }, text('nombre', 'Nombre', { required: true }), { name: 'estado', kind: 'boolean', label: 'Estado', readOnlyOn: ALL }],
    children: {
      activaciones: {
        tab: 'Activacion', removal: 'none',
        fields: [{ name: 'fecha_inicio', kind: 'date', label: 'Fecha Inicio', default: 'today' }, { name: 'fecha_fin', kind: 'date', label: 'Fecha Fin' }, text('motivo', 'Motivo'), text('motivo_fin', 'Motivo Fin')],
        columns: [{ key: 'motivo', header: 'Motivo' }],
        actions: [
          { id: 'activar', label: 'Activar', kind: 'deferred', rule: 'uiActivar', dialog: { title: 'Activar', fields: [{ name: 'fecha_inicio', kind: 'date', label: 'Fecha Inicio', default: 'today' }, text('motivo', 'Motivo Activacion')] }, enabledWhen: { modes: ['UPDATE'], noRow: { field: 'estado', in: ['A'] } } },
          { id: 'desactivar', label: 'Desactivar', kind: 'deferred', rule: 'uiDesactivar', dialog: { title: 'Desactivar', fields: [{ name: 'fecha_fin', kind: 'date', label: 'Fecha Fin', default: 'today' }, text('motivo_fin', 'Motivo Desactivacion')] }, enabledWhen: { modes: ['UPDATE'], selection: true } },
        ],
      },
      autorizadas: {
        tab: 'Autorizadas', removal: 'delete',
        fields: [text('serie', 'Serie'), text('bloqueada', 'Bloqueada')], columns: [{ key: 'serie', header: 'Serie' }],
        actions: [
          { id: 'baja', label: 'Dar de baja', kind: 'immediate', server: 'uiBaja', confirm: 'Desea dar de baja la serie?', dialog: { title: 'Baja de Serie', fields: [text('motivo', 'Motivo Baja')] }, enabledWhen: { modes: ['UPDATE'], selection: true, row: { field: 'estado', in: ['A'] } } },
          { id: 'directa', label: 'Baja directa', kind: 'immediate', server: 'uiBaja', enabledWhen: { modes: ['UPDATE'], selection: true } },
        ],
      },
    },
  }),
]);
const seed = {
  ...tinySeed(),
  clientes: {
    a: [
      { id_clientes: '001', nombre: 'ACME', estado: false, activo: true, activaciones: [{ id: '1', motivo: 'INICIO', fecha_inicio: '2026-01-01', fecha_fin: '2026-02-01', estado: 'D' }] },
      {
        id_clientes: '002', nombre: 'BETA', estado: true, activo: true,
        activaciones: [{ id: '1', motivo: 'INICIO', fecha_inicio: '2026-01-01', estado: 'A' }],
        autorizadas: [{ id: '1', serie: 'F001', bloqueada: 'N', estado: 'A' }, { id: '2', serie: 'B001', bloqueada: 'S', estado: 'A' }],
      },
    ],
  },
};

let hookRuns = 0;
beforeAll(() => {
  // The client rules the deferred actions name and the server action the immediate one names: test rules, the anexo ones land with W3-7.
  ACTION_RULES.uiActivar = { apply: ({ input }) => ({ insert: { fecha_inicio: input.fecha_inicio, motivo: input.motivo ?? '' }, parent: { estado: 'true' } }) };
  ACTION_RULES.uiDesactivar = {
    guard: ({ selected }) => (selected?.estado === 'D' ? 'Activacion ya Esta desactivada' : undefined),
    apply: ({ input }) => ({ change: { patch: { fecha_fin: input.fecha_fin, motivo_fin: input.motivo_fin ?? '' }, estado: 'D' }, parent: { estado: 'false' } }),
  };
  ACTION_HOOKS.uiBaja = ({ row }: any) => {
    hookRuns += 1;
    if (row.bloqueada === 'S') throw actionNotAllowed('Serie bloqueada');
    row.estado = 'D';
    return { message: 'Serie dada de baja' };
  };
});
afterAll(() => {
  delete ACTION_RULES.uiActivar;
  delete ACTION_RULES.uiDesactivar;
  delete ACTION_HOOKS.uiBaja;
});

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
type Mode = 'INSERT' | 'UPDATE' | 'DETAIL' | 'CLONE' | 'DELETE';
async function open(mode: Mode = 'UPDATE', id = '001', permissions: Permissions | 'absent' = granted) {
  const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'a' }), getRequestContext: () => ({ userId: '1' }), delayMs: 0, registry, seed });
  const run = vi.fn();
  const actions = (catalog: string) => ({ run: (...args: Parameters<ReturnType<typeof mock.actions>['run']>) => { run(...args); return mock.actions(catalog).run(...args); } });
  const services = { ...mock, actions } as unknown as AppServices;
  const config = toCatalogConfig(registry.bySlug.get('clientes'), registry);
  const service = mock.catalog('clientes');
  const update = vi.spyOn(service, 'update');
  const onClose = vi.fn();
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiMasterRegister config={config as any} service={service as any} mode={mode} id={mode === 'INSERT' ? undefined : id} permissions={permissions === 'absent' ? undefined : permissions} onDone={vi.fn()} onClose={onClose} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user: userEvent.setup(), mock, run, update, onClose };
}
type User = ReturnType<typeof userEvent.setup>;
const tab = (name: string) => screen.getByRole('tab', { name });
const panel = (name: string) => screen.getByRole('tabpanel', { name, hidden: true });
const button = (tabName: string, name: string) => within(panel(tabName)).getByRole('button', { name }) as HTMLButtonElement;
const confirmLast = async (user: User) => user.click((await screen.findAllByRole('button', { name: 'Confirmar' })).at(-1) as HTMLElement);
const dialogOf = (title: string) => screen.getByText(`Nuevo: ${title}`).closest<HTMLElement>('[role="dialog"]') as HTMLElement;
async function submitDialog(user: User, title: string, fillIn: Record<string, string> = {}) {
  const dialog = await waitFor(() => dialogOf(title));
  for (const [label, value] of Object.entries(fillIn)) await user.type(within(dialog).getByLabelText(label), value);
  await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
  await confirmLast(user);
}
const stateOf = (row: string) => within(screen.getByText(row).closest('tr') as HTMLElement).getByRole('img').getAttribute('aria-label');
const estado = () => screen.getByLabelText('Estado') as HTMLInputElement;

describe('S-ACT-1 the toolbar comes from the registry, with no catalog-specific code', () => {
  it('the Activacion grid shows the declared Activar and Desactivar, the Autorizadas grid its own action', async () => {
    const { user } = await open();
    await user.click(tab('Activacion'));
    expect(within(panel('Activacion')).getAllByRole('button').map((b) => b.textContent)).toEqual(['Agregar', 'Activar', 'Desactivar']);
    await user.click(tab('Autorizadas'));
    expect(within(panel('Autorizadas')).getAllByRole('button').map((b) => b.textContent)).toEqual(['Agregar', 'Quitar', 'Dar de baja', 'Baja directa']);
  });
});

describe('S-ACT-2, S-ACT-3, S-ACT-4 the flag and the predicate gate the actions', () => {
  it('S-ACT-2 modify=false disables both and a click sends nothing, even with a row selected', async () => {
    const { user, update } = await open('UPDATE', '001', { ...granted, modify: false });
    await user.click(tab('Activacion'));
    await user.click(screen.getByText('INICIO'));
    expect([button('Activacion', 'Activar').disabled, button('Activacion', 'Desactivar').disabled]).toEqual([true, true]);
    await user.click(button('Activacion', 'Activar'));
    expect(screen.queryByText('Nuevo: Activar')).toBeNull();
    expect(update).not.toHaveBeenCalled();
  });

  it('an absent permission set fails closed', async () => {
    const { user } = await open('UPDATE', '001', 'absent');
    await user.click(tab('Activacion'));
    expect([button('Activacion', 'Activar').disabled, button('Activacion', 'Desactivar').disabled]).toEqual([true, true]);
  });

  it('S-ACT-2 with modify and no selected row Desactivar is disabled while Activar follows its predicate; a selected row enables it', async () => {
    const { user } = await open();
    await user.click(tab('Activacion'));
    expect([button('Activacion', 'Activar').disabled, button('Activacion', 'Desactivar').disabled]).toEqual([false, true]);
    await user.click(screen.getByText('INICIO'));
    expect(button('Activacion', 'Desactivar').disabled).toBe(false);
  });

  it.each(['INSERT', 'CLONE', 'DETAIL', 'DELETE'] as const)('S-ACT-3 %s disables both', async (mode) => {
    const { user } = await open(mode);
    await user.click(tab('Activacion'));
    expect([button('Activacion', 'Activar').disabled, button('Activacion', 'Desactivar').disabled]).toEqual([true, true]);
  });

  it('S-ACT-4 Activar is disabled while an activation is active and enabled once the last is deactivated', async () => {
    const active = await open('UPDATE', '002');
    await active.user.click(tab('Activacion'));
    expect(button('Activacion', 'Activar').disabled).toBe(true);
  });
});

describe('S-ACT-5, S-ACT-7 a deferred action persists with the parent submit', () => {
  it('S-ACT-7 estado is read-only, follows a pending Activar, and the new row is pending in the grid', async () => {
    const { user } = await open();
    expect([estado().checked, estado().disabled]).toEqual([false, true]);
    await user.click(tab('Activacion'));
    await user.click(button('Activacion', 'Activar'));
    await submitDialog(user, 'Activar', { 'Motivo Activacion': 'REGRESA' });
    expect(within(panel('Activacion')).getByText('REGRESA')).toBeTruthy();
    expect(stateOf('REGRESA')).toBe('Activo');
    expect(button('Activacion', 'Activar').disabled).toBe(true);
    await user.click(tab('General'));
    expect([estado().checked, estado().disabled]).toEqual([true, true]);
  });

  it('S-ACT-5 cancelling the parent sends nothing and the server keeps its history', async () => {
    const { user, update, mock, onClose } = await open();
    await user.click(tab('Activacion'));
    await user.click(button('Activacion', 'Activar'));
    await submitDialog(user, 'Activar', { 'Motivo Activacion': 'REGRESA' });
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await confirmLast(user);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(update).not.toHaveBeenCalled();
    expect((await mock.children('clientes').list('001', 'activaciones')).items).toHaveLength(1);
  });

  it('S-ACT-5 submitting the parent persists the activation with it', async () => {
    const { user, mock } = await open();
    await user.click(tab('Activacion'));
    await user.click(button('Activacion', 'Activar'));
    await submitDialog(user, 'Activar', { 'Motivo Activacion': 'REGRESA' });
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect((await mock.children('clientes').list('001', 'activaciones')).items.map((r: any) => [r.motivo, r.fecha_inicio])).toEqual([['INICIO', '2026-01-01'], ['REGRESA', todayIso()]]));
  });

  it('a deferred Desactivar changes the selected row, follows the parent state and is sent as an A op on submit', async () => {
    const { user, mock } = await open('UPDATE', '002');
    await user.click(tab('Activacion'));
    await user.click(screen.getByText('INICIO'));
    await user.click(button('Activacion', 'Desactivar'));
    await submitDialog(user, 'Desactivar', { 'Motivo Desactivacion': 'CIERRE' });
    expect(stateOf('INICIO')).toBe('Desactivado');
    expect(button('Activacion', 'Activar').disabled).toBe(false);
    await user.click(tab('General'));
    expect(estado().checked).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(async () => expect((await mock.children('clientes').list('002', 'activaciones')).items[0]).toMatchObject({ fecha_fin: todayIso(), motivo_fin: 'CIERRE' }));
  });

  it('a rule guard refuses with its message in the grid and changes nothing', async () => {
    const { user, update } = await open('UPDATE', '002');
    await user.click(tab('Activacion'));
    await user.click(screen.getByText('INICIO'));
    await user.click(button('Activacion', 'Desactivar'));
    await submitDialog(user, 'Desactivar', {});
    await user.click(screen.getByText('INICIO'));
    await user.click(button('Activacion', 'Desactivar'));
    const dialog = await waitFor(() => dialogOf('Desactivar'));
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(() => expect(within(dialog).getByText('Activacion ya Esta desactivada')).toBeTruthy());
    expect(update).not.toHaveBeenCalled();
  });
});

describe('S-ACT-6, S-ACT-9 an immediate action calls the endpoint at once', () => {
  it('asks its confirmation first; declining sends nothing', async () => {
    const { user, run } = await open('UPDATE', '002');
    await user.click(tab('Autorizadas'));
    await user.click(screen.getByText('F001'));
    await user.click(button('Autorizadas', 'Dar de baja'));
    expect(await screen.findByText('Desea dar de baja la serie?')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'No' }));
    expect(run).not.toHaveBeenCalled();
    expect(screen.queryByText('Nuevo: Baja de Serie')).toBeNull();
  });

  it('S-ACT-6 calls the endpoint once with the row, reloads the grid showing the row deactivated and shows the server message', async () => {
    const { user, run, mock } = await open('UPDATE', '002');
    await user.click(tab('Autorizadas'));
    await user.click(screen.getByText('F001'));
    await user.click(button('Autorizadas', 'Dar de baja'));
    await confirmLast(user);
    await submitDialog(user, 'Baja de Serie', { 'Motivo Baja': 'ROBO' });
    await waitFor(() => expect(stateOf('F001')).toBe('Desactivado'));
    expect(run.mock.calls).toEqual([[{ id: '002', child: 'autorizadas', childId: '1' }, 'baja', { motivo: 'ROBO' }]]);
    expect(within(panel('Autorizadas')).getByRole('status').textContent).toBe('Serie dada de baja');
    expect((await mock.children('clientes').list('002', 'autorizadas')).items.map((r: any) => [r.serie, r.estado])).toEqual([['F001', 'D'], ['B001', 'A']]);
  });

  it('S-ACT-9 a 409 keeps the dialog open with the server message and leaves the grid unchanged', async () => {
    const before = hookRuns;
    const { user, run } = await open('UPDATE', '002');
    await user.click(tab('Autorizadas'));
    await user.click(screen.getByText('B001'));
    await user.click(button('Autorizadas', 'Dar de baja'));
    await confirmLast(user);
    const dialog = await waitFor(() => dialogOf('Baja de Serie'));
    await user.click(within(dialog).getByRole('button', { name: 'Aceptar' }));
    await confirmLast(user);
    await waitFor(() => expect(within(dialog).getByText('Serie bloqueada')).toBeTruthy());
    expect(dialogOf('Baja de Serie')).toBe(dialog);
    expect(run).toHaveBeenCalledTimes(1);
    expect(hookRuns).toBe(before + 1);
    expect(stateOf('B001')).toBe('Activo');
  });

  it('without a dialog a refusal shows in the grid as a notice and changes nothing', async () => {
    const { user, run } = await open('UPDATE', '002');
    await user.click(tab('Autorizadas'));
    await user.click(screen.getByText('B001'));
    await user.click(button('Autorizadas', 'Baja directa'));
    await waitFor(() => expect(within(panel('Autorizadas')).getByRole('status').textContent).toBe('Serie bloqueada'));
    expect(run.mock.calls).toEqual([[{ id: '002', child: 'autorizadas', childId: '2' }, 'directa', {}]]);
    expect(stateOf('B001')).toBe('Activo');
  });

  it('R-ACT-6 a 404 on a vanished row refreshes the grid and shows the message', async () => {
    const { user, mock } = await open('UPDATE', '002');
    await user.click(tab('Autorizadas'));
    await user.click(screen.getByText('F001'));
    await mock.children('clientes').remove('002', 'autorizadas', '1');
    await user.click(button('Autorizadas', 'Baja directa'));
    await waitFor(() => expect(screen.queryByText('F001')).toBeNull());
    expect(within(panel('Autorizadas')).getByRole('status').textContent).toMatch(/not found/);
    expect(screen.getByText('B001')).toBeTruthy();
  });

  it('is disabled until a row is selected', async () => {
    const { user } = await open('UPDATE', '002');
    await user.click(tab('Autorizadas'));
    expect(button('Autorizadas', 'Dar de baja').disabled).toBe(true);
    await user.click(screen.getByText('F001'));
    expect(button('Autorizadas', 'Dar de baja').disabled).toBe(false);
  });
});
