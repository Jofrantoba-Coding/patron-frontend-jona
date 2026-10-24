import { afterEach, describe, expect, it } from 'vitest';
import { deleteRecord, listCatalog } from './catalog.js';
import { RULES_REGISTRY, RULES_SEED } from './children.rules.fixture';
import { getChild, listChild } from './nested.js';
import { createStore } from './store.js';

const store = createStore(RULES_SEED, RULES_REGISTRY);
afterEach(() => store.reset());

const fails = (run: () => unknown) => { try { run(); } catch (e: any) { return [e.status, e.code]; } throw new Error('expected a failure'); };
const section = (name: string) => store.data('a')[name];

describe('S-MOCK-44 / S-MD-10 cascade on a logical parent delete (R-MOCK-21, R-MD-7)', () => {
  it('deletes the parent even though it has children and removal none (not blocked)', () => {
    expect(() => deleteRecord(store, 'a', 'vendedores', '001', {})).not.toThrow();
    expect(listCatalog(store, 'a', 'vendedores', {}, {}).items.map((r: any) => r.id_vendedores)).toEqual(['002']);
  });

  it('logically deletes every child row, deactivated ones included', () => {
    deleteRecord(store, 'a', 'vendedores', '001', {});
    expect(section('vendedores/activaciones').map((r: any) => [r.id, r.activo])).toEqual([['1', false], ['2', false]]);
    expect(section('vendedores/notas').map((r: any) => r.activo)).toEqual([false]);
  });

  it('the nested routes then answer 404', () => {
    deleteRecord(store, 'a', 'vendedores', '001', {});
    expect(fails(() => listChild(store, 'a', 'vendedores', '001', 'activaciones', {}, {}))).toEqual([404, 'NOT_FOUND']);
    expect(fails(() => getChild(store, 'a', 'vendedores', '001', 'activaciones', '2', {}))).toEqual([404, 'NOT_FOUND']);
  });

  it('leaves the children of other parents alone', () => {
    deleteRecord(store, 'a', 'items', '001', {});
    expect(section('items/almacenes').map((r: any) => [r.id, r.activo !== false])).toEqual([['1', false], ['2', false], ['3', false], ['4', true]]);
    expect(listChild(store, 'a', 'items', '002', 'almacenes', {}, {}).items).toHaveLength(1);
  });

  it('a parent without children deletes as before', () => {
    deleteRecord(store, 'a', 'vendedores', '002', {});
    expect(listCatalog(store, 'a', 'vendedores', {}, {}).items.map((r: any) => r.id_vendedores)).toEqual(['001']);
    expect(section('vendedores/activaciones')).toHaveLength(2);
  });
});
