import { describe, expect, it } from 'vitest';
import type { ActionConfig } from '../../catalogs/CatalogConfig';
import { DENY_ALL, PERMISSION_FLAGS, type Permissions } from '../permissions';
import { resolveRowAction, type RowActionContext } from './toolbarGate';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;
const action = (over: Partial<ActionConfig> = {}): ActionConfig => ({ id: 'x', label: 'X', placement: 'child', flag: 'modify', kind: 'deferred', rule: 'r', ...over });
const ctx = (over: Partial<RowActionContext> = {}): RowActionContext => ({ permissions: granted, mode: 'UPDATE', rows: [], hasParent: true, ...over });
const activar = action({ id: 'activar', enabledWhen: { modes: ['UPDATE'], noRow: { field: 'estado', in: ['A'] } } });
const desactivar = action({ id: 'desactivar', enabledWhen: { modes: ['UPDATE'], selection: true } });
const active = { _key: '1', estado: 'A' };
const deactivated = { _key: '2', estado: 'D' };

describe('R-ACT-2 a row action is enabled by its flag and its enabledWhen', () => {
  it('S-ACT-2 modify=false disables both and a missing permission set fails closed', () => {
    const denied = { ...granted, modify: false };
    expect([activar, desactivar].map((a) => resolveRowAction(a, ctx({ permissions: denied, selected: active })))).toEqual([false, false]);
    expect(resolveRowAction(activar, ctx({ permissions: DENY_ALL }))).toBe(false);
    expect(resolveRowAction(activar, ctx({ permissions: undefined }))).toBe(false);
  });

  it('S-ACT-2 the flag is the declared one, not always modify', () => {
    expect(resolveRowAction(action({ flag: 'details' }), ctx({ permissions: { ...granted, modify: false, details: true } }))).toBe(true);
    expect(resolveRowAction(action({ flag: 'details' }), ctx({ permissions: { ...granted, details: false } }))).toBe(false);
  });

  it('S-ACT-2 with modify and no selected row Desactivar is disabled while Activar follows its predicate', () => {
    expect(resolveRowAction(desactivar, ctx())).toBe(false);
    expect(resolveRowAction(desactivar, ctx({ selected: active }))).toBe(true);
    expect(resolveRowAction(activar, ctx())).toBe(true);
  });

  it.each(['INSERT', 'CLONE', 'DETAIL', 'DELETE'] as const)('S-ACT-3 %s disables both activation actions', (mode) => {
    expect([activar, desactivar].map((a) => resolveRowAction(a, ctx({ mode, selected: active })))).toEqual([false, false]);
  });

  it('S-ACT-4 Activar needs no active row: disabled when the last activation is active, enabled when it is deactivated', () => {
    expect(resolveRowAction(activar, ctx({ rows: [deactivated, active] }))).toBe(false);
    expect(resolveRowAction(activar, ctx({ rows: [deactivated] }))).toBe(true);
  });

  it('a row condition looks at the selected row', () => {
    const onlyActive = action({ enabledWhen: { selection: true, row: { field: 'estado', in: ['A'] } } });
    expect([active, deactivated].map((selected) => resolveRowAction(onlyActive, ctx({ selected })))).toEqual([true, false]);
  });

  it('a read-only register disables every action even when no mode is declared', () => {
    expect(resolveRowAction(action(), ctx({ mode: 'DETAIL' }))).toBe(false);
    expect(resolveRowAction(action(), ctx({ mode: 'INSERT' }))).toBe(true);
  });

  it('an immediate action needs a saved parent, and its row form a saved row', () => {
    const immediate = action({ kind: 'immediate', server: 's', rule: undefined, enabledWhen: { selection: true } });
    expect(resolveRowAction(immediate, ctx({ selected: active, hasParent: false }))).toBe(false);
    expect(resolveRowAction(immediate, ctx({ selected: { _key: '~1', estado: 'A' }, selectedPending: true }))).toBe(false);
    expect(resolveRowAction(immediate, ctx({ selected: active }))).toBe(true);
  });
});
