import { describe, expect, it } from 'vitest';
import type { CrudAction } from '../../catalogs/CatalogConfig';
import { DENY_ALL, PERMISSION_FLAGS, type Permissions } from '../permissions';
import { DEFAULT_ACTIONS, canTrigger, resolveToolbar } from './toolbarGate';

const only = (...flags: (keyof Permissions)[]): Permissions => ({
  ...DENY_ALL,
  ...Object.fromEntries(flags.map((f) => [f, true])),
});
const enabledOf = (actions: CrudAction[], permissions: Permissions, selectedId?: string) =>
  Object.fromEntries(resolveToolbar(actions, permissions, selectedId).map((i) => [i.action, i.enabled]));

describe('resolveToolbar', () => {
  it('S-CRUD-2: add=true, modify=false leaves Add enabled and Modify disabled even with a row selected', () => {
    expect(enabledOf(['add', 'modify'], only('add'), '7')).toEqual({ add: true, modify: false });
  });

  it('S-CRUD-3: a row-dependent action needs a selected row; add and refresh do not', () => {
    const permissions = only('add', 'modify', 'refresh');

    expect(enabledOf(['add', 'modify', 'refresh'], permissions)).toEqual({ add: true, modify: false, refresh: true });
    expect(enabledOf(['add', 'modify', 'refresh'], permissions, '7')).toEqual({ add: true, modify: true, refresh: true });
    expect(enabledOf(['modify'], permissions, '')).toEqual({ modify: false });
  });

  it('S-SHELL-8: with each flag false, its action is disabled even when every other flag is true and a row is selected', () => {
    const allTrue = only(...PERMISSION_FLAGS);
    for (const action of DEFAULT_ACTIONS) {
      const state = resolveToolbar([action], { ...allTrue, [action]: false }, '7')[0];
      expect(state, action).toMatchObject({ action, enabled: false });
      expect(resolveToolbar([action], allTrue, '7')[0].enabled, action).toBe(true);
    }
  });

  it('keeps the configured order and renders only the configured actions', () => {
    expect(resolveToolbar(['refresh', 'add'], only('add'), undefined).map((i) => i.action)).toEqual(['refresh', 'add']);
  });

  it('defaults to every action but export when none are configured', () => {
    expect(resolveToolbar(undefined, only('add'), undefined).map((i) => i.action)).toEqual([...DEFAULT_ACTIONS]);
    expect(DEFAULT_ACTIONS).not.toContain('export');
  });

  it('export is never enabled, not even with its flag and a row, and is marked unimplemented', () => {
    const [item] = resolveToolbar(['export'], only('export'), '7');
    expect(item).toEqual({ action: 'export', enabled: false, implemented: false, shortcut: 'Alt+X' });
    expect(resolveToolbar(['add'], only('add'))[0].implemented).toBe(true);
  });
});

describe('canTrigger (S-CRUD-4: click and shortcut share this gate)', () => {
  it('denies a permission-denied action and allows a granted one', () => {
    expect(canTrigger('eliminate', only('modify'), '7')).toBe(false);
    expect(canTrigger('eliminate', only('eliminate'), '7')).toBe(true);
  });

  it('denies a row-dependent action without a row, and an action absent from the toolbar', () => {
    expect(canTrigger('eliminate', only('eliminate'))).toBe(false);
    expect(canTrigger('add', only('add'), undefined, ['refresh'])).toBe(false);
  });
});
