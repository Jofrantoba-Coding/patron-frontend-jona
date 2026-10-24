import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, updateRecord } from './catalog.js';
import { parentEntry } from './children.fixture';
import { todayIso } from './dates.js';
import { listChild } from './nested.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers';

/** A bank-like parent: `activaciones` (no removal) opens with the INICIO row the server creates (R-MD-9, D11). */
const activaciones = (over: Record<string, any> = {}) => ({
  tab: 'Activacion', removal: 'none', initial: { motivo: 'INICIO' },
  fields: [{ name: 'motivo', kind: 'text', label: 'motivo', max: 30 }, { name: 'f_inicio', kind: 'date', label: 'f_inicio', default: 'today' }],
  columns: [{ key: 'motivo', header: 'Motivo' }], ...over,
});
const registry = validateRegistry([parentEntry('bancos', { children: { activaciones: activaciones() } })]);
const seed = { ...tinySeed(), bancos: { a: [{ id_bancos: '001', nombre: 'BCP', activo: true, activaciones: [{ id: '1', motivo: 'UNO', estado: 'A' }, { id: '2', motivo: 'DOS', estado: 'D' }, { id: '3', motivo: 'TRES', estado: 'D' }] }] } };
const store = createStore(seed, registry);
const rows = (id: string) => listChild(store, 'a', 'bancos', id, 'activaciones', {}, {}).items.map((r: any) => [r.motivo, r.f_inicio, r.estado]);

describe('child initial row (R-MD-9, D11)', () => {
  it('creates the initial row of a new parent that sends no child ops, as CLONE does', () => {
    const created = createRecord(store, 'a', 'bancos', { nombre: 'COPIA DE BCP' }, {});
    expect(rows(created.id_bancos)).toEqual([['INICIO', todayIso(), 'A']]);
  });

  it('does not add it when the body already inserts a row of that child, and never on update or for the other parents', () => {
    const sent = createRecord(store, 'a', 'bancos', { nombre: 'PROPIO', children: { activaciones: [{ op: 'I', motivo: 'PROPIO' }] } }, {});
    expect(rows(sent.id_bancos).map((row: string[]) => row[0])).toEqual(['PROPIO']);
    updateRecord(store, 'a', 'bancos', '001', { nombre: 'BCP 2' }, {});
    expect(rows('001').map((row: string[]) => row[0])).toEqual(['UNO', 'DOS', 'TRES']);
  });

  it('a failing parent leaves no initial row behind', () => {
    const before = JSON.stringify(store.data('a'));
    expect(() => createRecord(store, 'a', 'bancos', { nombre: '' }, {})).toThrow();
    expect(JSON.stringify(store.data('a'))).toBe(before);
  });
});

describe('child initial at load', () => {
  const load = (initial: unknown) => () => validateRegistry([parentEntry('bancos', { children: { activaciones: activaciones({ initial }) } })]);

  it.each([
    ['a non-object', 'INICIO', /initial must be an object/],
    ['an unknown field', { nope: 'x' }, /initial names unknown field "nope"/],
  ])('rejects %s', (_name, initial, message) => {
    expect(load(initial)).toThrow(message);
  });
});
