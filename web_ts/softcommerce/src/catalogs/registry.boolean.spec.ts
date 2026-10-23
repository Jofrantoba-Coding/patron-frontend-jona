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
