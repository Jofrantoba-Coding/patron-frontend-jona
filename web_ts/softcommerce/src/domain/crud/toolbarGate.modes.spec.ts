import { describe, expect, it } from 'vitest';
import { DENY_ALL, PERMISSION_FLAGS, type Permissions } from '../permissions';
import { DEFAULT_ACTIONS, actionsForModes, canTrigger, resolveToolbar } from './toolbarGate';

const allGranted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

describe('actionsForModes (R-CRUD-16, D14)', () => {
  it('S-CRUD-36 drops add, eliminate and clone when only UPDATE and DETAIL are supported', () => {
    expect(actionsForModes(DEFAULT_ACTIONS, ['UPDATE', 'DETAIL'])).toEqual(['modify', 'details', 'search', 'refresh']);
  });

  it('keeps the configured order and the actions that have no mode (search, refresh, export)', () => {
    expect(actionsForModes(['export', 'refresh', 'add', 'modify'], ['INSERT'])).toEqual(['export', 'refresh', 'add']);
  });

  it('leaves the actions as they are without modes (Wave 1 configs)', () => {
    expect(actionsForModes(undefined, undefined)).toBeUndefined();
    expect(actionsForModes(['add'], undefined)).toEqual(['add']);
  });

  it('filters BEFORE permission gating: a granted but unsupported action is not rendered nor triggerable', () => {
    const actions = actionsForModes(undefined, ['UPDATE', 'DETAIL']);
    expect(resolveToolbar(actions, allGranted, '7').map((i) => i.action)).toEqual(['modify', 'details', 'search', 'refresh']);
    expect(canTrigger('add', allGranted, '7', actions)).toBe(false);
    expect(canTrigger('modify', allGranted, '7', actions)).toBe(true);
    expect(canTrigger('modify', DENY_ALL, '7', actions)).toBe(false);
  });
});
