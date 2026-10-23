import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { validate } from '../domain/crud/validate';
import { normalize } from '../domain/crud/normalize';
import { toCatalogConfig } from './registry';

/** A registry select over ubigeo that is `transient`, `restoreFrom` a record code and `filter`ed is the ZonaDistancia cascade (R-CRUD-12, D8, 11.0). */
const zonas = {
  slug: 'zonas', idKey: 'id_zona', codeWidth: 0, entity: 'una Zona', scope: 'tenant', seed: 'zonas', messages: { style: 'M1' },
  fields: [{ name: 'id_zona', kind: 'code', label: 'Código' }, { name: 'descripcion', kind: 'text', label: 'Descripción', max: 10 }],
  columns: [{ key: 'descripcion', header: 'D' }],
};
const build = (cascade: Record<string, unknown>) =>
  toCatalogConfig(
    validateRegistry([zonas, {
      slug: 'rutas', idKey: 'id_ruta', codeWidth: 0, entity: 'una Ruta', scope: 'tenant', seed: 'rutas', messages: { style: 'MS' },
      fields: [
        { name: 'id_ruta', kind: 'code', label: 'Código' },
        { name: 'id_distrito', kind: 'select', label: 'Distrito', required: true, source: { catalog: 'ubigeo' }, ...cascade },
        { name: 'id_zona', kind: 'select', label: 'Zona', required: true, article: 'una', source: { catalog: 'zonas' }, dependsOn: [{ field: 'id_distrito', filterKey: 'id_ubigeo' }] },
      ],
      columns: [{ key: 'id_zona', header: 'Z' }],
      joins: [{ as: 'id_ubigeo', ref: 'id_zona', display: 'descripcion' }],
    }]).bySlug.get('rutas'),
  );
const cascade = (config: ReturnType<typeof build>) => config.fields.find((f) => f.name === 'id_distrito') as Extract<(typeof config.fields)[number], { kind: 'cascade' }>;
const DECLARED = { transient: true, filter: { has: 'zonas' }, restoreFrom: { field: 'id_ubigeo', prefixLen: 6 } };

describe('the registry cascade carries transient, restoreFrom and filter to the UI config', () => {
  it('maps the three of them onto the cascade field, which still has its three levels named after the leaf', () => {
    const field = cascade(build(DECLARED));
    expect([field.kind, field.transient, field.filter, field.restoreFrom]).toEqual(['cascade', true, { has: 'zonas' }, { field: 'id_ubigeo', prefixLen: 6 }]);
    expect(field.levels.map((l) => l.name)).toEqual(['id_departamento', 'id_provincia', 'id_distrito']);
  });

  it('a plain cascade stays as W1 had it: none of the three is set', () => {
    const field = cascade(build({}));
    expect([field.transient, field.filter, field.restoreFrom]).toEqual([undefined, undefined, undefined]);
  });

  it('the zona keeps its parent, the cascade leaf, with the ubigeo filter key', () => {
    expect(build(DECLARED).fields.find((f) => f.name === 'id_zona')).toMatchObject({ dependsOn: [{ field: 'id_distrito', filterKey: 'id_ubigeo' }] });
  });

  it('the client words the first unset level in the MS style, then the zona', () => {
    const config = build(DECLARED);
    const rules = { entry: config.entry!, mode: 'INSERT' as const };
    expect(validate(config.fields, { id_departamento: '', id_provincia: '', id_distrito: '', id_zona: '' }, rules).map((e) => e.message)).toEqual(['Para agregar una Ruta, debes Seleccionar un Departamento.']);
    expect(validate(config.fields, { id_departamento: '15', id_provincia: '1501', id_distrito: '150101', id_zona: '' }, rules).map((e) => e.message)).toEqual(['Para agregar una Ruta, debes Seleccionar una Zona.']);
  });

  it('the payload drops every level of a transient cascade, and only the leaf of a plain one stays', () => {
    const values = { id_departamento: '15', id_provincia: '1501', id_distrito: '150101', id_zona: '1' };
    expect(normalize(build(DECLARED).fields, values)).toEqual({ id_zona: '1' });
    expect(normalize(build({}).fields, values)).toEqual({ id_distrito: '150101', id_zona: '1' });
  });
});
