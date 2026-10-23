import { describe, expect, it } from 'vitest';
import { createRecord } from './catalog.js';
import { validateRegistry } from '../registry/schema.js';
import { createStore } from './store.js';
import { readSeed } from './test-helpers.js';

/**
 * A ref `parent` over an `exists` lookup filter (R-CRUD-12, S-CRUD-40): the tipo of a UsuarioCorrelativo is offered by punto de venta through
 * `exists`, so the server must judge "belongs to the parent" with the same rule, not by a column the tipo row does not have.
 * Test-only entries; the real pair is tipos-doc-venta / correlativos / usuario-correlativos.
 */
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
  entry('usos', {
    fields: [
      text('id_sede'),
      { name: 'id_tipo', kind: 'select', label: 'Tipo', required: true, source: { catalog: 'series' }, dependsOn: [{ field: 'id_sede', filterKey: 'id_sede' }] },
    ],
  }),
]);
const asignacion = (id: string, id_tipo: string, id_sede: string, estado = 'A', activo = true) => ({ id_asignaciones: id, id_tipo, id_sede, estado, activo });
const store = () =>
  createStore(
    {
      ...readSeed(),
      series: [{ id_tipo: '01', descripcion: 'FACTURA', activo: true }, { id_tipo: '03', descripcion: 'BOLETA', activo: true }, { id_tipo: 'TI', descripcion: 'TICKET', activo: true }],
      asignaciones: { demo: [asignacion('1', '01', '1'), asignacion('2', '03', '1', 'I'), asignacion('3', 'TI', '2'), asignacion('4', '01', '2', 'A', false)], botica: [] },
      usos: { demo: [], botica: [] },
    },
    registry,
  );
const create = (body: Record<string, unknown>) => createRecord(store(), 'demo', 'usos', body);
const fails = (body: Record<string, unknown>) => {
  try { create(body); } catch (e: any) { return e.details; }
  return undefined;
};

describe('a ref parent over an exists filter', () => {
  it('accepts a tipo that has an active assignment in the chosen parent', () => {
    expect(create({ id_sede: '1', id_tipo: '01' })).toMatchObject({ id_sede: '1', id_tipo: '01' });
    expect(create({ id_sede: '2', id_tipo: 'TI' })).toMatchObject({ id_tipo: 'TI' });
  });

  it('rejects a tipo assigned only to another parent, on the tipo, naming the parent', () => {
    expect(fails({ id_sede: '1', id_tipo: 'TI' })).toEqual([{ field: 'id_tipo', code: 'REF_NOT_FOUND', message: 'id_tipo does not belong to id_sede' }]);
  });

  it('an assignment whose estado is not the declared where, or that was deleted, does not count', () => {
    expect(fails({ id_sede: '1', id_tipo: '03' })?.[0].field).toBe('id_tipo');
    expect(fails({ id_sede: '2', id_tipo: '01' })?.[0].field).toBe('id_tipo');
  });

  it('an unknown parent value has nothing to belong to', () => {
    expect(fails({ id_sede: '99', id_tipo: '01' })?.[0].field).toBe('id_tipo');
  });
});
