import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { lookupOptions } from './lookups.js';
import { createStore } from './store.js';
import { readSeed } from './test-helpers.js';

/** Test-only entry: the desktop shows a tabla SUNAT as `nombre - descripcion` (RegisterUnidadMedida.loadTablaSunat), so an option label can join fields. */
const text = (name: string) => ({ name, kind: 'text', label: name, required: true, max: 30 });
const entry = (over: Record<string, any> = {}): Record<string, any> => ({
  slug: 'tablas', idKey: 'id_tabla', codeWidth: 0, entity: 'una tabla', scope: 'shared', seed: 'tablas', readOnly: true, messages: { style: 'M1' },
  fields: [{ name: 'id_tabla', kind: 'code', label: 'Código' }, text('nombre'), text('descripcion')], columns: [{ key: 'nombre', header: 'N' }],
  optionLabel: ['nombre', 'descripcion'], ...over,
});

describe('optionLabel over several fields (R-MOCK-16)', () => {
  it('joins the fields with " - " in the options of the endpoint', () => {
    const registry = validateRegistry([entry()]);
    const store = createStore({ ...readSeed(), tablas: [{ id_tabla: 6, nombre: 'TABLA 6', descripcion: 'UNIDAD DE MEDIDA', activo: true }, { id_tabla: 7, nombre: 'TABLA 7', descripcion: '', activo: true }] }, registry);
    expect(lookupOptions(store, 'demo', 'tablas').items).toEqual([{ id: '6', name: 'TABLA 6 - UNIDAD DE MEDIDA' }, { id: '7', name: 'TABLA 7' }]);
  });

  it('a single field name keeps working', () => {
    const registry = validateRegistry([entry({ optionLabel: 'nombre' })]);
    const store = createStore({ ...readSeed(), tablas: [{ id_tabla: 6, nombre: 'TABLA 6', descripcion: 'UNIDAD', activo: true }] }, registry);
    expect(lookupOptions(store, 'demo', 'tablas').items).toEqual([{ id: '6', name: 'TABLA 6' }]);
  });

  it.each([
    ['an unknown field in the list', { optionLabel: ['nombre', 'ghost'] }, /optionLabel.*unknown field "ghost"/],
    ['an empty list', { optionLabel: [] }, /optionLabel needs at least one field/],
    ['a value that is neither a name nor a list', { optionLabel: 7 }, /optionLabel must be a field name or a list of field names/],
  ])('the registry rejects %s', (_name, over, message) => {
    expect(() => validateRegistry([entry(over)])).toThrow(message);
  });
});
