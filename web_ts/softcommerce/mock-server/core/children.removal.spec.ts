import { afterEach, describe, expect, it } from 'vitest';
import { updateRecord } from './catalog.js';
import { RULES_REGISTRY, RULES_SEED } from './children.rules.fixture';
import { createChild, getChild, listChild, removeChild, updateChild } from './nested.js';
import { createStore } from './store.js';

const store = createStore(RULES_SEED, RULES_REGISTRY);
afterEach(() => store.reset());

const rows = (parent: string, id: string, child: string) => listChild(store, 'a', parent, id, child, {}, {}).items.map((r: any) => [r.id, r.estado]);
const fails = (run: () => unknown) => { try { run(); } catch (e: any) { return [e.status, e.code]; } throw new Error('expected a failure'); };

describe('S-MOCK-41 child removal kinds (R-MD-4)', () => {
  it('deactivate keeps the row listed with estado D', () => {
    removeChild(store, 'a', 'items', '001', 'almacenes', '1', {});
    expect(rows('items', '001', 'almacenes')).toEqual([['1', 'D'], ['2', 'D'], ['3', 'A']]);
    expect(getChild(store, 'a', 'items', '001', 'almacenes', '1', {})).toMatchObject({ estado: 'D' });
  });

  it('removing an already deactivated row keeps it deactivated and listed', () => {
    removeChild(store, 'a', 'items', '001', 'almacenes', '2', {});
    expect(rows('items', '001', 'almacenes')).toEqual([['1', 'A'], ['2', 'D'], ['3', 'A']]);
  });

  it('delete removes the row from the list', () => {
    removeChild(store, 'a', 'vendedores', '001', 'notas', '1', {});
    expect(rows('vendedores', '001', 'notas')).toEqual([]);
    expect(fails(() => getChild(store, 'a', 'vendedores', '001', 'notas', '1', {}))).toEqual([404, 'NOT_FOUND']);
  });

  it('none has no delete: 405 MODE_NOT_SUPPORTED and the row stays', () => {
    expect(fails(() => removeChild(store, 'a', 'vendedores', '001', 'activaciones', '1', {}))).toEqual([405, 'MODE_NOT_SUPPORTED']);
    expect(rows('vendedores', '001', 'activaciones')).toEqual([['1', 'A'], ['2', 'D']]);
  });
});

describe('R-MOCK-21 a deactivated row is never reactivated by a body estado', () => {
  it('a nested PUT with estado A leaves the row deactivated', () => {
    updateChild(store, 'a', 'items', '001', 'almacenes', '2', { almacen: 'B2', estado: 'A' }, {});
    expect(getChild(store, 'a', 'items', '001', 'almacenes', '2', {})).toMatchObject({ almacen: 'B2', estado: 'D' });
  });

  it('a composite A op with estado A leaves the row deactivated, and estado D deactivates an active one', () => {
    updateRecord(store, 'a', 'items', '001', { children: { almacenes: [{ op: 'A', id: '2', almacen: 'B', proceso: 'VENTA', estado: 'A' }, { op: 'A', id: '1', almacen: 'A', proceso: 'VENTA', estado: 'D' }] } }, {});
    expect(rows('items', '001', 'almacenes')).toEqual([['1', 'D'], ['2', 'D'], ['3', 'A']]);
  });

  it('a nested POST ignores a body estado', () => {
    const created = createChild(store, 'a', 'items', '002', 'almacenes', { almacen: 'Z', proceso: 'VENTA', estado: 'D' }, {});
    expect(created).toMatchObject({ estado: 'A' });
  });
});
