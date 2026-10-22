import { describe, expect, it } from 'vitest';
import { createStore } from './store.js';
import { childrenOf } from './ubigeo.js';
import { readSeed } from './test-helpers.js';

const store = createStore(readSeed());
const ids = (parent?: string) => childrenOf(store, parent).items.map((u: any) => u.id);

describe('childrenOf', () => {
  it('S-MOCK-8 returns departamentos for an empty or missing parent', () => {
    const expected = ['04', '07', '08', '15'];
    expect(ids('')).toEqual(expected);
    expect(ids(undefined)).toEqual(expected);
  });

  it('S-MOCK-8 returns only the provincias of a departamento', () => {
    expect(ids('15')).toEqual(['1501', '1505']);
    expect(ids('04')).toEqual(['0401', '0402']);
  });

  it('S-MOCK-8 returns only the distritos of a provincia', () => {
    expect(ids('1501')).toEqual(['150101', '150102', '150103']);
    expect(ids('1505')).toEqual(['150501', '150502']);
  });

  it('keeps names with each child', () => {
    expect(childrenOf(store, '150').items).toEqual([]);
    expect(childrenOf(store, '1501').items[2]).toEqual({ id: '150103', name: 'ATE' });
  });

  it('S-MOCK-9 returns an empty list for an unknown parent, not an error', () => {
    expect(ids('99')).toEqual([]);
    expect(ids('9999')).toEqual([]);
  });

  it('returns an empty list for a malformed parent or a distrito (no children level)', () => {
    expect(ids('150')).toEqual([]);
    expect(ids('ab')).toEqual([]);
    expect(ids('150101')).toEqual([]);
  });
});
