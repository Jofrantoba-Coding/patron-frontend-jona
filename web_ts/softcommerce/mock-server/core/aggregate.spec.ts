import { describe, expect, it } from 'vitest';
import { createRecord, getRecord, listCatalog, updateRecord } from './catalog.js';
import { aggregateValue, aggregateValues } from './aggregate.js';
import { parentEntry } from './children.fixture';
import { validateRegistry } from '../registry/schema.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers';

const count = { as: 'cant_dir', child: 'direcciones', op: 'count', where: { estado: 'A' } } as const;
const sum = { as: 'total', child: 'montos', op: 'sum', field: 'monto' } as const;

describe('D27 pure aggregate: a count or a sum over the rows of one child', () => {
  const rows = [{ estado: 'A', monto: '1500' }, { estado: 'D', monto: 20.5 }, { estado: 'A', monto: 'x', activo: false }, { estado: 'A', monto: '0.255' }];

  it('counts the rows that match `where` and are not logically deleted', () => {
    expect(aggregateValue(count, rows)).toBe(2);
    expect(aggregateValue({ as: 'n', child: 'c', op: 'count' }, rows)).toBe(3);
  });

  it('sums the field as numbers (a blank or non-numeric value counts as 0) and rounds to cents', () => {
    expect(aggregateValue(sum, rows)).toBe(1520.76);
    expect(aggregateValue(sum, [])).toBe(0);
  });

  it('aggregateValues keys each result by `as`, asking the caller for the rows of the named child', () => {
    expect(aggregateValues([count, sum], (child) => (child === 'direcciones' ? rows : [{ monto: 5 }]))).toEqual({ cant_dir: 2, total: 5 });
  });
});

const registry = validateRegistry([parentEntry('clientes', { aggregate: [count] })]);
const seed = { ...tinySeed(), clientes: { a: [{ id_clientes: '001', nombre: 'ACME', activo: true, direcciones: [{ id: '1', direccion: 'AV 1', estado: 'A' }, { id: '2', direccion: 'AV 2', estado: 'D' }, { id: '3', direccion: 'AV 3', estado: 'A', activo: false }] }, { id_clientes: '002', nombre: 'BETA', activo: true }], b: [] } };

describe('D27 server: enrich adds the aggregate to the list, the get and the write answers, and a body never writes it', () => {
  const make = () => createStore(seed, registry);

  it('list and get carry the count of the active rows', () => {
    const store = make();
    expect(listCatalog(store, 'a', 'clientes', {}, {}).items.map((r: any) => [r.id_clientes, r.cant_dir])).toEqual([['001', 1], ['002', 0]]);
    expect(getRecord(store, 'a', 'clientes', '001', {}).cant_dir).toBe(1);
  });

  it('a composite write is reflected in the answer, and a body value is ignored', () => {
    const store = make();
    const created = createRecord(store, 'a', 'clientes', { nombre: 'NUEVO', cant_dir: 99, children: { direcciones: [{ op: 'I', direccion: 'AV 9' }, { op: 'I', direccion: 'AV 10' }] } }, {});
    expect(created.cant_dir).toBe(2);
    expect(updateRecord(store, 'a', 'clientes', '002', { nombre: 'BETA', cant_dir: 7 }, {}).cant_dir).toBe(0);
    expect(store.data('a').clientes.find((r: any) => r.id_clientes === '002')).not.toHaveProperty('cant_dir');
  });
});

describe('D27 schema: the aggregate declaration is checked at load', () => {
  const load = (aggregate: unknown) => () => validateRegistry([parentEntry('clientes', { aggregate })]);

  it('accepts a count and a sum over a declared child', () => {
    expect(load([count, { as: 'total', child: 'contactos', op: 'sum', field: 'nombre' }])).not.toThrow();
  });

  it.each([
    ['not a list', {}, /aggregate must be a list/],
    ['an unknown child', [{ as: 'n', child: 'nada', op: 'count' }], /aggregate "n" names unknown child "nada"/],
    ['an unknown op', [{ as: 'n', child: 'direcciones', op: 'avg' }], /aggregate "n" has unknown op "avg"/],
    ['a sum with no field', [{ as: 'n', child: 'direcciones', op: 'sum' }], /aggregate "n" needs a field to sum/],
    ['a sum over an unknown field', [{ as: 'n', child: 'direcciones', op: 'sum', field: 'nope' }], /aggregate "n" names unknown field "nope" of child "direcciones"/],
    ['a duplicate name', [count, count], /duplicate aggregate "cant_dir"/],
    ['a name that is a stored field', [{ as: 'nombre', child: 'direcciones', op: 'count' }], /aggregate "nombre" is also a field with a kind other than number/],
  ])('rejects %s', (_name, aggregate, message) => {
    expect(load(aggregate)).toThrow(message);
  });
});
