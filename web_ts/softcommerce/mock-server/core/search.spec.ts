import { describe, expect, it } from 'vitest';
import { listCatalog } from './catalog.js';
import type { MockError } from './errors.js';
import { acceptedListKeys, matchesTerms, searchTerms } from './search.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';
import { validateRegistry } from '../registry/schema.js';

/** Test-only entries: no real catalog declares `search` yet. */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion')], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});

const ENTRIES = [
  entry('personas', {
    search: ['id_personas', 'nombre', 'dni'],
    fields: [{ name: 'id_personas', kind: 'code', label: 'Codigo' }, text('nombre'), text('dni')],
  }),
  entry('plano', { fields: [text('nombre')] }),
  entry('marcas'),
  entry('autos', {
    search: ['placa', 'ciudad', 'marca'],
    fields: [
      text('placa'), text('ciudad'),
      { name: 'id_marca', kind: 'select', label: 'Marca', source: { catalog: 'marcas' } },
    ],
    joins: [{ as: 'marca', ref: 'id_marca', display: 'descripcion' }],
  }),
];

const person = (id: string, nombre: string, extra: Record<string, any> = {}) => ({ id_personas: id, nombre, dni: `4000${id}`, activo: true, ...extra });
const autos = Array.from({ length: 28 }, (_, i) => ({
  id_autos: String(i + 1),
  placa: i < 3 ? `AB-${100 + i}` : `PL-${100 + i}`,
  ciudad: i < 2 ? 'LIMA' : 'CUSCO',
  id_marca: i < 25 ? '1' : '2',
  activo: true,
}));
const SEED = {
  personas: {
    a: [
      person('001', 'JUAN PEREZ LOPEZ'),
      person('002', 'MARIA GARCIA RAMOS'),
      person('003', 'PEDRO PEREZ SOTO', { activo: false }),
      person('004', 'ANA 100% A.*B'),
    ],
  },
  plano: { a: [{ id_plano: '1', nombre: 'ALGO', activo: true }] },
  marcas: { a: [{ id_marcas: '1', descripcion: 'TOYOTA', activo: true }, { id_marcas: '2', descripcion: 'HYUNDAI', activo: true }] },
  autos: { a: autos },
};

const store = () => createStore({ ...tinySeed(), ...structuredClone(SEED) }, validateRegistry(ENTRIES));
const names = (page: any) => page.items.map((r: any) => r.nombre);
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};

describe('searchTerms and matchesTerms (pure)', () => {
  it('splits on whitespace, lowercases and drops blanks', () => {
    expect(searchTerms('  Perez   JUAN ')).toEqual(['perez', 'juan']);
    expect(searchTerms('')).toEqual([]);
    expect(searchTerms(undefined)).toEqual([]);
  });

  it('needs every term in some field, matching literally', () => {
    const row = { nombre: 'JUAN PEREZ', dni: '123' };
    expect(matchesTerms(row, ['nombre', 'dni'], ['perez', '123'])).toBe(true);
    expect(matchesTerms(row, ['nombre'], ['perez', '123'])).toBe(false);
    expect(matchesTerms({ nombre: 'A.*B' }, ['nombre'], ['.*'])).toBe(true);
    expect(matchesTerms(row, ['nombre'], ['.*'])).toBe(false);
  });
});

describe('S-MOCK-45 q search', () => {
  it('q=perez juan matches JUAN PEREZ LOPEZ only, and an inactive match never returns', () => {
    expect(names(listCatalog(store(), 'a', 'personas', { q: 'perez juan' }))).toEqual(['JUAN PEREZ LOPEZ']);
    expect(names(listCatalog(store(), 'a', 'personas', { q: 'perez' }))).toEqual(['JUAN PEREZ LOPEZ']);
  });

  it('a blank q returns every active record', () => {
    expect(listCatalog(store(), 'a', 'personas', { q: '' }).pagination.total).toBe(3);
    expect(listCatalog(store(), 'a', 'personas', { q: '   ' }).pagination.total).toBe(3);
  });

  it('searches the declared fields, code and dni included', () => {
    expect(names(listCatalog(store(), 'a', 'personas', { q: '002' }))).toEqual(['MARIA GARCIA RAMOS']);
    expect(names(listCatalog(store(), 'a', 'personas', { q: '4000001 juan' }))).toEqual(['JUAN PEREZ LOPEZ']);
  });

  it('% and .* are literal: they match only a row that holds them', () => {
    const s = store();
    expect(names(listCatalog(s, 'a', 'personas', { q: '%' }))).toEqual(['ANA 100% A.*B']);
    expect(names(listCatalog(s, 'a', 'personas', { q: '.*' }))).toEqual(['ANA 100% A.*B']);
    expect(listCatalog(s, 'a', 'personas', { q: '%%' }).items).toEqual([]);
    expect(listCatalog(s, 'a', 'personas', { q: 'perez.*' }).items).toEqual([]);
  });

  it('q on an entry with no declared search answers an empty list, never an error', () => {
    const page = listCatalog(store(), 'a', 'plano', { q: 'algo' });
    expect(page.items).toEqual([]);
    expect(page.pagination.total).toBe(0);
    expect(listCatalog(store(), 'a', 'plano', { q: '' }).pagination.total).toBe(1);
  });
});

describe('S-MOCK-46 joined key filters and paging', () => {
  it('marca=toy filters over the joined display and pages the 25 matches', () => {
    const s = store();
    const second = listCatalog(s, 'a', 'autos', { marca: 'toy', page: 2, pageSize: 10 });
    expect(second.items).toHaveLength(10);
    expect(second.pagination).toEqual({ page: 2, pageSize: 10, total: 25 });
    expect(listCatalog(s, 'a', 'autos', { marca: 'toy', page: 3, pageSize: 10 }).items).toHaveLength(5);
    expect(second.items.every((r: any) => r.marca === 'TOYOTA')).toBe(true);
  });

  it('placa=ab&q=lima combine with AND', () => {
    const page = listCatalog(store(), 'a', 'autos', { placa: 'ab', q: 'lima' });
    expect(page.items.map((r: any) => r.placa)).toEqual(['AB-100', 'AB-101']);
    expect(listCatalog(store(), 'a', 'autos', { placa: 'ab', q: 'cusco' }).items.map((r: any) => r.placa)).toEqual(['AB-102']);
  });

  it('an unknown key answers 400 INVALID_FILTER', () => {
    const error = caught(() => listCatalog(store(), 'a', 'autos', { nope: 'x' }));
    expect([error.status, error.code]).toEqual([400, 'INVALID_FILTER']);
    expect(caught(() => listCatalog(store(), 'a', 'plano', { q: 'a', nope: 'x' })).code).toBe('INVALID_FILTER');
  });

  it('accepts fields, joins and ref fields as filter keys', () => {
    const s = store();
    expect([...acceptedListKeys(s, s.registry.bySlug.get('autos'))].sort()).toEqual(expect.arrayContaining(['placa', 'ciudad', 'id_marca', 'marca']));
  });
});
