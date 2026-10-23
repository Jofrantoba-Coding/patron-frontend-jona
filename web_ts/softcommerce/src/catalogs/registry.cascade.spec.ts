import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { validate } from '../domain/crud/validate';
import { toCatalogConfig } from './registry';

/** A registry `select` over `ubigeo` is the W1 departamento > provincia > distrito cascade storing `id_ubigeo` (R-LOC-4, D8, R-REF-6). */
const build = (style: 'M1' | 'MS', required: boolean) =>
  toCatalogConfig(
    validateRegistry([
      {
        slug: 'sitios', idKey: 'id_sitio', codeWidth: 0, entity: 'un Almacen', scope: 'tenant', seed: 'sitios', messages: { style },
        fields: [
          { name: 'id_sitio', kind: 'code', label: 'Código' },
          { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100 },
          { name: 'id_ubigeo', kind: 'select', label: 'Distrito', required, source: { catalog: 'ubigeo' } },
        ],
        columns: [{ key: 'descripcion', header: 'Descripción' }],
      },
    ]).entries[0],
  );
const cascade = (config: ReturnType<typeof build>) => config.fields.find((f) => f.name === 'id_ubigeo') as Extract<(typeof config.fields)[number], { kind: 'cascade' }>;
const errors = (config: ReturnType<typeof build>, values: Record<string, string>) =>
  validate(config.fields, { descripcion: 'X', id_departamento: '', id_provincia: '', id_ubigeo: '', ...values }, { entry: config.entry!, mode: 'INSERT' }).map((e) => [e.name, e.message]);

describe('a select over ubigeo becomes the cascade', () => {
  it('has the three levels with the leaf named after the field, and restores the levels above from the stored distrito', () => {
    const field = cascade(build('M1', true));
    expect([field.kind, field.lookup, field.required, field.levels.map((l) => [l.name, l.label])]).toEqual([
      'cascade', 'ubigeo', true, [['id_departamento', 'Departamento'], ['id_provincia', 'Provincia'], ['id_ubigeo', 'Distrito']],
    ]);
    expect(field.ancestorsOf('150101')).toEqual(['15', '1501']);
  });

  it('a select over any other catalog stays a select', () => {
    const config = toCatalogConfig(validateRegistry([{
      slug: 'cosas', idKey: 'id_cosa', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'cosas', messages: { style: 'M1' },
      fields: [{ name: 'id_tipo', kind: 'select', label: 'Tipo', source: { catalog: 'cosas' } }], columns: [{ key: 'id_tipo', header: 'T' }],
    }]).entries[0]);
    expect(config.fields[0].kind).toBe('select');
  });
});

describe('S-REF-13 / S-REF-33 the first unset level is the error, worded by the entry style', () => {
  it('M1 names the level: departamento, then provincia, then distrito', () => {
    const config = build('M1', true);
    expect(errors(config, {})).toEqual([['id_departamento', 'Para agregar un Almacen, debes especificar su Departamento.']]);
    expect(errors(config, { id_departamento: '15' })).toEqual([['id_provincia', 'Para agregar un Almacen, debes especificar su Provincia.']]);
    expect(errors(config, { id_departamento: '15', id_provincia: '1501' })).toEqual([['id_ubigeo', 'Para agregar un Almacen, debes especificar su Distrito.']]);
  });

  it('MS says Seleccionar with the article of each level', () => {
    const config = build('MS', true);
    expect(errors(config, {})[0][1]).toBe('Para agregar un Almacen, debes Seleccionar un Departamento.');
    expect(errors(config, { id_departamento: '15' })[0][1]).toBe('Para agregar un Almacen, debes Seleccionar una Provincia.');
    expect(errors(config, { id_departamento: '15', id_provincia: '1501' })[0][1]).toBe('Para agregar un Almacen, debes Seleccionar un Distrito.');
  });

  it('a complete cascade passes, and an optional one never blocks, even half chosen', () => {
    expect(errors(build('M1', true), { id_departamento: '15', id_provincia: '1501', id_ubigeo: '150101' })).toEqual([]);
    expect(errors(build('M1', false), {})).toEqual([]);
    expect(errors(build('M1', false), { id_departamento: '15' })).toEqual([]);
  });
});
