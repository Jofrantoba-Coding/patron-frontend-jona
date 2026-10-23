import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { toCatalogConfig } from './registry';

const entry = validateRegistry([
  {
    slug: 'cosas', idKey: 'id_cosa', codeWidth: 3, entity: 'una cosa', scope: 'tenant', seed: null, messages: { style: 'M1' },
    fields: [
      { name: 'id_cosa', kind: 'code', label: 'Código' },
      { name: 'hab_guia', kind: 'boolean', label: 'Hab Guia', default: false },
      { name: 'estado', preset: 'estado' },
    ],
    columns: [{ key: 'id_cosa', header: 'Código' }, { key: 'hab_guia', header: 'Hab Guia', type: 'bool' }],
  },
]).bySlug.get('cosas');

describe('toCatalogConfig over boolean fields (R-CRUD-11, R-REF-3 estado)', () => {
  const config = toCatalogConfig(entry);

  it('carries the default and readOnlyOn of a boolean field, and the estado preset', () => {
    expect(config.fields[1]).toMatchObject({ kind: 'boolean', name: 'hab_guia', label: 'Hab Guia', default: false });
    expect(config.fields[2]).toMatchObject({ kind: 'boolean', name: 'estado', label: 'Activo', default: { INSERT: true }, readOnlyOn: ['INSERT', 'CLONE', 'DETAIL', 'DELETE'] });
  });

  it('a bool column asks the list for Sí / No; a plain column does not', () => {
    expect(config.columns[1]).toMatchObject({ key: 'hab_guia', format: 'bool' });
    expect(config.columns[0]).not.toHaveProperty('format');
  });
});

describe('toCatalogConfig over options fields (R-CRUD-11, S-CRUD-30)', () => {
  const tipos = validateRegistry([
    {
      slug: 'tipos', idKey: 'id_tipo', codeWidth: 3, entity: 'un tipo', scope: 'tenant', seed: null, messages: { style: 'M1' },
      fields: [
        { name: 'id_tipo', kind: 'code', label: 'Código' },
        { name: 'tipo', kind: 'options', label: 'Tipo de Movimiento', required: true, display: 'radio', options: [{ value: 'E', label: 'Entrada' }, { value: 'S', label: 'Salida' }] },
      ],
      columns: [{ key: 'id_tipo', header: 'Código' }, { key: 'tipo_label', header: 'Tipo de Movimiento' }],
    },
  ]).bySlug.get('tipos');

  it('carries the options, display and required flag; the option column reads <name>_label', () => {
    const config = toCatalogConfig(tipos);
    expect(config.fields[1]).toMatchObject({ kind: 'options', name: 'tipo', required: true, display: 'radio', options: [{ value: 'E', label: 'Entrada' }, { value: 'S', label: 'Salida' }] });
    expect(config.columns[1]).toMatchObject({ key: 'tipo_label', header: 'Tipo de Movimiento' });
  });
});
