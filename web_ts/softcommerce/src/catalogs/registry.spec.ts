import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { findDrift } from '../../test/catalogs/drift';
import type { CatalogConfig } from './CatalogConfig';
import { toCatalogConfig } from './registry';

const entryOf = (over: Record<string, unknown> = {}) =>
  validateRegistry([
    {
      slug: 'cosas', idKey: 'id_cosa', codeWidth: 3, entity: 'un Cosa', scope: 'tenant', seed: 'cosas', formId: 'miCosa', title: 'Cosa',
      messages: { style: 'M1' },
      fields: [
        { name: 'id_cosa', kind: 'code', label: 'Código' },
        { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100, normalize: ['upper'] },
        { name: 'nota', kind: 'text', label: 'Nota', max: 20, normalize: [] },
      ],
      columns: [{ key: 'id_cosa', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }],
      ...over,
    },
  ]).entries[0];

describe('toCatalogConfig (G15 UI adapter)', () => {
  it('derives the list and register config from a registry entry', () => {
    const entry = entryOf();
    const config = toCatalogConfig(entry);

    expect(config).toMatchObject({ formId: 'miCosa', title: 'Cosa', catalog: 'cosas', idKey: 'id_cosa', entry });
    expect(config.modes).toEqual(['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE']);
    expect(config.columns).toEqual([
      { key: 'id_cosa', header: 'Código', sortable: true },
      { key: 'descripcion', header: 'Descripción', sortable: true },
    ]);
    expect(config.fields).toEqual([
      { kind: 'code', name: 'id_cosa', label: 'Código' },
      { kind: 'text', name: 'descripcion', label: 'Descripción', required: true, maxLength: 100, uppercase: true, normalize: ['upper'] },
      { kind: 'text', name: 'nota', label: 'Nota', required: false, maxLength: 20, uppercase: false, normalize: [] },
    ]);
  });

  it('carries the entry modes so the toolbar can drop unsupported actions', () => {
    expect(toCatalogConfig(entryOf({ modes: ['UPDATE', 'DETAIL'] })).modes).toEqual(['UPDATE', 'DETAIL']);
  });

  it('fails loudly for a field kind that has no UI yet instead of rendering nothing', () => {
    const entry = entryOf({ fields: [{ name: 'cantidad', kind: 'date', label: 'Cantidad' }] });
    expect(() => toCatalogConfig(entry)).toThrow('cosas.cantidad: the UI does not support kind "date" yet');
  });
});

describe('S-REG-2 / R-REG-3 UI config consistency', () => {
  it('a derived config has no drift', () => {
    const entry = entryOf();
    expect(findDrift(toCatalogConfig(entry), entry)).toEqual([]);
  });

  it('names the catalog and field when the UI max differs from the registry', () => {
    const entry = entryOf();
    const config = toCatalogConfig(entry);
    const drifted = { ...config, fields: config.fields.map((f) => (f.name === 'descripcion' ? { ...f, maxLength: 99 } : f)) } as CatalogConfig<any>;
    expect(findDrift(drifted, entry)).toEqual(['cosas.descripcion: max 100 != UI maxLength 99']);
  });

  it('names the field when the UI drops a required flag or a field', () => {
    const entry = entryOf();
    const config = toCatalogConfig(entry);
    const fields = config.fields.filter((f) => f.name !== 'nota').map((f) => (f.name === 'descripcion' ? { ...f, required: false } : f));
    expect(findDrift({ ...config, fields } as CatalogConfig<any>, entry)).toEqual([
      'cosas.descripcion: required true != UI false',
      'cosas.nota: missing in the UI config',
    ]);
  });

  // Every real entry with a derived UI (Localidad keeps its hand-written config, checked in its compat spec).
  describe.each(REGISTRY.entries.filter((e: any) => !e.compat))('$slug', (entry: any) => {
    it('derives a config without drift', () => {
      expect(findDrift(toCatalogConfig(entry), entry)).toEqual([]);
    });
  });
});
