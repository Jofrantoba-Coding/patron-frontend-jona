import { describe, expect, it } from 'vitest';
import { RegistryError, validateRegistry } from './schema.js';

/**
 * The ubigeo cascade as the parent of another select (R-CRUD-12, D8): its levels are `transient` (the server never sees them), `restoreFrom
 * { field, prefixLen }` rebuilds them from a ubigeo code the record carries, and `filter { has }` keeps the ubigeos holding an active row of a catalog.
 */
const cascade = (over: Record<string, unknown> = {}) => ({
  name: 'id_distrito', kind: 'select', label: 'Distrito', required: true, source: { catalog: 'ubigeo' }, transient: true, filter: { has: 'zonas' },
  restoreFrom: { field: 'id_ubigeo', prefixLen: 6 }, ...over,
});
const zonas = {
  slug: 'zonas', idKey: 'id_zona', codeWidth: 0, entity: 'una Zona', scope: 'tenant', seed: 'zonas', messages: { style: 'M1' },
  fields: [{ name: 'id_zona', kind: 'code', label: 'Código' }, { name: 'descripcion', kind: 'text', label: 'Descripción', max: 10 }, { name: 'id_ubigeo', kind: 'select', label: 'Distrito', source: { catalog: 'ubigeo' } }],
  columns: [{ key: 'descripcion', header: 'D' }],
};
const entry = (field: Record<string, unknown> = cascade(), over: Record<string, unknown> = {}) => ({
  slug: 'rutas', idKey: 'id_ruta', codeWidth: 0, entity: 'una Ruta', scope: 'tenant', seed: 'rutas', messages: { style: 'MS' },
  fields: [
    { name: 'id_ruta', kind: 'code', label: 'Código' },
    field,
    { name: 'id_zona', kind: 'select', label: 'Zona', required: true, source: { catalog: 'zonas' }, dependsOn: [{ field: 'id_distrito', filterKey: 'id_ubigeo' }] },
  ],
  columns: [{ key: 'id_zona', header: 'Z' }],
  joins: [{ as: 'id_ubigeo', ref: 'id_zona', display: 'id_ubigeo' }],
  ...over,
});
const failure = (field?: Record<string, unknown>, over?: Record<string, unknown>) => {
  try { validateRegistry([zonas, entry(field, over)]); } catch (e) { return e instanceof RegistryError ? e.message : String(e); }
  return undefined;
};

describe('transient, restoreFrom and filter are validated at load (R-REG-4)', () => {
  it('accepts the cascade of ZonaDistancia: transient, restored from a joined ubigeo code, filtered by zonas', () => {
    expect(failure()).toBeUndefined();
  });

  it('a transient field is no ref: the server neither validates it nor checks the parent it is for the zona', () => {
    const resolved = validateRegistry([zonas, entry()]).bySlug.get('rutas');
    expect(resolved.refs.map((r: any) => r.field)).toEqual(['id_zona']);
    expect(resolved.refs[0].parents).toEqual([]);
    // The client still validates its levels first; only the ref step of the transient select is gone.
    expect(resolved.steps).toEqual(['id_distrito', 'id_zona', { ref: 'id_zona' }]);
  });

  it('transient must be a boolean on a select', () => {
    expect(failure(cascade({ transient: 'yes' }))).toMatch(/transient must be a boolean/);
    expect(failure({ name: 'id_distrito', kind: 'text', label: 'X', transient: true })).toMatch(/transient needs a select field/);
  });

  it('restoreFrom needs a field and a positive whole prefixLen, on a select over ubigeo', () => {
    expect(failure(cascade({ restoreFrom: { field: 'id_ubigeo' } }))).toMatch(/restoreFrom needs a field and a prefixLen/);
    expect(failure(cascade({ restoreFrom: { field: 'id_ubigeo', prefixLen: 0 } }))).toMatch(/restoreFrom needs a field and a prefixLen/);
    expect(failure(cascade({ source: { catalog: 'zonas' } }))).toMatch(/restoreFrom needs a select over ubigeo/);
  });

  it('restoreFrom must name a field or a join of the entry', () => {
    expect(failure(cascade({ restoreFrom: { field: 'nada', prefixLen: 6 } }))).toMatch(/restoreFrom names unknown field "nada"/);
  });

  it('filter is an object of text values on a select over ubigeo, and names a known catalog in has', () => {
    expect(failure(cascade({ filter: { has: 'nada' } }))).toMatch(/filter has names unknown catalog "nada"/);
    expect(failure(cascade({ filter: { has: 3 } }))).toMatch(/filter must be an object of text values/);
    expect(failure(cascade({ filter: { otro: 'zonas' } }))).toMatch(/filter names unknown key "otro"/);
    expect(failure(cascade({ source: { catalog: 'zonas' } }))).toMatch(/needs a select over ubigeo/);
  });
});
