import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import type { MockError } from './errors.js';
import { lookupOptions } from './lookups.js';
import { createStore } from './store.js';
import { readSeed } from './test-helpers.js';

/** Test-only entries for the `exists` lookup filter of R-MOCK-16; the real pair is tipos-doc-venta and correlativos. */
const text = (name: string) => ({ name, kind: 'text', label: name, required: true, max: 10 });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion')], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const registry = validateRegistry([
  entry('series', {
    idKey: 'id_tipo', scope: 'shared', readOnly: true,
    fields: [{ name: 'id_tipo', kind: 'code', label: 'Código' }, text('descripcion')],
    lookupFilters: { id_sede: { exists: { catalog: 'asignaciones', local: 'id_tipo', where: { estado: 'A' } } } },
  }),
  entry('asignaciones', { fields: [text('id_tipo'), text('id_sede'), text('estado')] }),
]);
const tipo = (id: string, activo = true) => ({ id_tipo: id, descripcion: `T${id}`, activo });
const asignacion = (id: string, id_tipo: string, id_sede: string, estado = 'A', activo = true) => ({ id_asignaciones: id, id_tipo, id_sede, estado, activo });
const store = () =>
  createStore(
    {
      ...readSeed(),
      series: [tipo('01'), tipo('03'), tipo('TI'), tipo('07', false)],
      asignaciones: {
        demo: [
          asignacion('1', '01', '1'),
          asignacion('2', 'TI', '1'),
          asignacion('3', '03', '1', 'I'),
          asignacion('4', '01', '10'),
          asignacion('5', '03', '2', 'A', false),
          asignacion('6', '07', '1'),
        ],
        botica: [asignacion('1', '03', '1')],
      },
    },
    registry,
  );
const ids = (tenant: string, filters: Record<string, string>) => lookupOptions(store(), tenant, 'series', filters).items.map((i: { id: string }) => i.id);
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};

describe('S-MOCK-30 exists: only the rows with an active assignment in the filter value', () => {
  it('returns the types that have an assignment in that sede, as {id,name}', () => {
    expect(lookupOptions(store(), 'demo', 'series', { id_sede: '1' }).items).toEqual([{ id: '01', name: 'T01' }, { id: 'TI', name: 'TTI' }]);
  });

  it('leaves out an assignment whose estado is not the declared where, and a deleted one', () => {
    expect(ids('demo', { id_sede: '1' })).not.toContain('03');
    expect(ids('demo', { id_sede: '2' })).toEqual([]);
  });

  it('leaves out a type that is itself retired, whatever its assignments', () => {
    expect(ids('demo', { id_sede: '1' })).not.toContain('07');
  });

  it('matches the filter value exactly: sede 1 never returns what belongs to sede 10', () => {
    expect(ids('demo', { id_sede: '10' })).toEqual(['01']);
    expect(ids('demo', { id_sede: '1' })).toEqual(['01', 'TI']);
  });

  it('an unknown value is an empty list, not an error', () => {
    expect(lookupOptions(store(), 'demo', 'series', { id_sede: 'zzz' })).toEqual({ items: [] });
  });

  it('reads the assignments of the tenant asking', () => {
    expect(ids('botica', { id_sede: '1' })).toEqual(['03']);
  });

  it('without the filter every active row comes back', () => {
    expect(ids('demo', {})).toEqual(['01', '03', 'TI']);
  });

  it('still rejects a key the entry does not declare', () => {
    expect(caught(() => lookupOptions(store(), 'demo', 'series', { id_zona: '1' })).code).toBe('INVALID_FILTER');
  });
});
