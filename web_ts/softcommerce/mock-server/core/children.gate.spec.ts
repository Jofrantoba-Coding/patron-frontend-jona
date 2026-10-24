import { afterEach, describe, expect, it } from 'vitest';
import { createRecord, updateRecord } from './catalog.js';
import { GATE_REGISTRY, GATE_SEED } from './children.rules.fixture';
import { createChild, listChild } from './nested.js';
import { createStore } from './store.js';

const store = createStore(GATE_SEED, GATE_REGISTRY);
afterEach(() => store.reset());

const fails = (run: () => unknown) => { try { run(); } catch (e: any) { return [e.status, e.code]; } throw new Error('expected a failure'); };
const names = (tenant: string, id: string) => store.data(tenant).clientes.flatMap((r: any) => (r.id_clientes === id ? [r.nombre] : [])).concat(store.data(tenant)['clientes/sustitutos'].filter((r: any) => r.id_clientes === id).map((r: any) => r.nombre));

describe('S-REG-25 server half: a gated-off child (R-REG-17)', () => {
  it('answers 404 to the nested routes and does not store a nested POST', () => {
    expect(fails(() => listChild(store, 'b', 'clientes', '001', 'sustitutos', {}, {}))).toEqual([404, 'NOT_FOUND']);
    expect(fails(() => createChild(store, 'b', 'clientes', '001', 'sustitutos', { nombre: 'X' }, {}))).toEqual([404, 'NOT_FOUND']);
    expect(store.data('b')['clientes/sustitutos']).toEqual([]);
  });

  it('ignores a body value for the child in a composite write: the parent is saved, no child row exists', () => {
    createRecord(store, 'b', 'clientes', { nombre: 'NUEVO', children: { sustitutos: [{ op: 'I', nombre: 'S1' }, { op: 'I', nombre: '' }] } }, {});
    updateRecord(store, 'b', 'clientes', '001', { nombre: 'ACME 2', children: { sustitutos: [{ op: 'I', nombre: 'S2' }] } }, {});
    expect(store.data('b')['clientes/sustitutos']).toEqual([]);
    expect(store.data('b').clientes.map((r: any) => r.nombre)).toEqual(['ACME 2', 'NUEVO']);
  });

  it('an unknown child name is still an error, gate or not', () => {
    expect(fails(() => createRecord(store, 'b', 'clientes', { nombre: 'N', children: { nada: [] } }, {}))).toEqual([422, 'VALIDATION_ERROR']);
  });

  it('with the parameter true the child works: nested routes and composite write', () => {
    expect(createChild(store, 'a', 'clientes', '001', 'sustitutos', { nombre: 'S1' }, {})).toMatchObject({ nombre: 'S1', estado: 'A' });
    createRecord(store, 'a', 'clientes', { nombre: 'NUEVO', children: { sustitutos: [{ op: 'I', nombre: 'S2' }] } }, {});
    expect(listChild(store, 'a', 'clientes', '002', 'sustitutos', {}, {}).items.map((r: any) => r.nombre)).toEqual(['S2']);
    expect(names('a', '001')).toEqual(['ACME', 'S1']);
  });

  it('a gate with `in` is open only for the listed values', () => {
    expect(listChild(store, 'a', 'clientes', '001', 'avisos', {}, {}).items).toEqual([]);
    expect(fails(() => listChild(store, 'b', 'clientes', '001', 'avisos', {}, {}))).toEqual([404, 'NOT_FOUND']);
  });
});
