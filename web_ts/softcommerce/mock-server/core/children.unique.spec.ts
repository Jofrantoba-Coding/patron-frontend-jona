import { afterEach, describe, expect, it } from 'vitest';
import { createRecord, updateRecord } from './catalog.js';
import { RULES_REGISTRY, RULES_SEED } from './children.rules.fixture';
import { createChild, getChild, listChild, removeChild, updateChild } from './nested.js';
import { createStore } from './store.js';

const store = createStore(RULES_SEED, RULES_REGISTRY);
afterEach(() => store.reset());

const MESSAGE = 'Almacen ya se Encuentra Activado';
const fails = (run: () => unknown) => {
  try { run(); } catch (e: any) { return { status: e.status, code: e.code, details: e.details.map((d: any) => [d.field, d.code, d.message]) }; }
  throw new Error('expected a failure');
};
const nested = (id: string, body: Record<string, unknown>) => createChild(store, 'a', 'items', id, 'almacenes', body, {});
const composite = (id: string, ops: unknown[]) => updateRecord(store, 'a', 'items', id, { children: { almacenes: ops } }, {});
const ids = (id: string) => listChild(store, 'a', 'items', id, 'almacenes', {}, {}).items.map((r: any) => [r.id, r.almacen, r.estado]);

describe('S-MOCK-43 child unique among active siblings (R-MOCK-21)', () => {
  it('an active pair answers 409 DUPLICATE with the literal message on the child field', () => {
    expect(fails(() => nested('001', { almacen: 'A', proceso: 'VENTA' }))).toEqual({ status: 409, code: 'DUPLICATE', details: [['almacen', 'DUPLICATE', MESSAGE]] });
  });

  it('a deactivated first row does not count: 201', () => {
    expect(nested('001', { almacen: 'B', proceso: 'VENTA' })).toMatchObject({ almacen: 'B', estado: 'A' });
    removeChild(store, 'a', 'items', '001', 'almacenes', '1', {});
    expect(nested('001', { almacen: 'A', proceso: 'VENTA' })).toMatchObject({ almacen: 'A' });
  });

  it('a PUT keeping its own values answers 200', () => {
    expect(updateChild(store, 'a', 'items', '001', 'almacenes', '1', { almacen: 'A', proceso: 'VENTA' }, {})).toMatchObject({ id: '1' });
  });

  it('a PUT onto another active row answers 409', () => {
    expect(fails(() => updateChild(store, 'a', 'items', '001', 'almacenes', '1', { almacen: 'C' }, {})).status).toBe(409);
  });

  it('the key is scoped by the parent: another item may hold the same pair', () => {
    expect(nested('002', { almacen: 'C', proceso: 'VENTA' })).toMatchObject({ almacen: 'C' });
  });
});

describe('S-MD-9 server half: composite write', () => {
  it('reports <child>[<n>].<field> with the index in the sent array', () => {
    expect(fails(() => composite('001', [{ op: 'I', almacen: 'Z', proceso: 'VENTA' }, { op: 'I', almacen: 'A', proceso: 'VENTA' }]))).toEqual({
      status: 409, code: 'DUPLICATE', details: [['almacenes[1].almacen', 'DUPLICATE', MESSAGE]],
    });
    expect(ids('001')).toEqual([['1', 'A', 'A'], ['2', 'B', 'D'], ['3', 'C', 'A']]);
  });

  it('two pending inserts of the same pair conflict with each other', () => {
    expect(fails(() => composite('001', [{ op: 'I', almacen: 'Z', proceso: 'VENTA' }, { op: 'I', almacen: 'Z', proceso: 'VENTA' }])).details[0][0]).toBe('almacenes[1].almacen');
    expect(ids('001')).toHaveLength(3);
  });

  it('deactivating a row in the same call frees its pair for an insert', () => {
    composite('001', [{ op: 'A', id: '1', almacen: 'A', proceso: 'VENTA', estado: 'D' }, { op: 'I', almacen: 'A', proceso: 'VENTA' }]);
    expect(ids('001')).toEqual([['1', 'A', 'D'], ['2', 'B', 'D'], ['3', 'C', 'A'], ['5', 'A', 'A']]);
  });

  it('an op A keeping its own values does not conflict with itself', () => {
    composite('001', [{ op: 'A', id: '1', almacen: 'A', proceso: 'VENTA' }]);
    expect(getChild(store, 'a', 'items', '001', 'almacenes', '1', {})).toMatchObject({ almacen: 'A' });
  });

  it('a new parent has no siblings yet, but its own pending pair conflicts', () => {
    expect(fails(() => createRecord(store, 'a', 'items', { nombre: 'NUEVO', children: { almacenes: [{ op: 'I', almacen: 'A', proceso: 'VENTA' }, { op: 'I', almacen: 'A', proceso: 'VENTA' }] } }, {})).details[0][0]).toBe('almacenes[1].almacen');
    expect(createRecord(store, 'a', 'items', { nombre: 'NUEVO', children: { almacenes: [{ op: 'I', almacen: 'A', proceso: 'VENTA' }] } }, {})).toMatchObject({ id_items: '003' });
  });
});
