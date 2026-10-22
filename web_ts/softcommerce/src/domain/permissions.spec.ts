import { describe, expect, it } from 'vitest';
import { DENY_ALL, PERMISSION_FLAGS, parsePermissions } from './permissions';

describe('permissions', () => {
  it('declares the 13 flags of the form permissions endpoint', () => {
    expect([...PERMISSION_FLAGS]).toEqual([
      'add', 'modify', 'eliminate', 'nullify', 'clone', 'details', 'search',
      'report', 'export', 'print', 'printFast', 'close', 'refresh',
    ]);
  });

  it('parses a full payload into the 13 booleans', () => {
    const allTrue = Object.fromEntries(PERMISSION_FLAGS.map((flag) => [flag, true]));
    const parsed = parsePermissions({ ...allTrue, modify: false, report: false });

    expect(Object.keys(parsed)).toEqual([...PERMISSION_FLAGS]);
    expect(parsed).toEqual({ ...allTrue, modify: false, report: false });
  });

  it('denies a missing flag and anything that is not exactly true', () => {
    const parsed = parsePermissions({ add: true, modify: 'true', eliminate: 1, clone: null, search: true, extra: true });

    expect(parsed.add).toBe(true);
    expect(parsed.search).toBe(true);
    expect(PERMISSION_FLAGS.filter((flag) => parsed[flag])).toEqual(['add', 'search']);
    expect('extra' in parsed).toBe(false);
  });

  it.each([[undefined], [null], ['yes'], [42], [[]]])('fails closed for a non-object payload (%j)', (raw) => {
    const parsed = parsePermissions(raw);

    expect(parsed).toEqual(DENY_ALL);
    expect(Object.keys(parsed)).toHaveLength(13);
    expect(Object.values(parsed).every((flag) => flag === false)).toBe(true);
  });
});
