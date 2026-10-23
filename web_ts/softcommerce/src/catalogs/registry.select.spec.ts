import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { toCatalogConfig } from './registry';

const entry = (fields: object[], over: object = {}) =>
  validateRegistry(
    [
      { slug: 'padres', idKey: 'id_padre', codeWidth: 0, entity: 'un padre', scope: 'tenant', seed: 'padres', messages: { style: 'M1' }, fields: [{ name: 'descripcion', kind: 'text', label: 'D' }], columns: [] },
      { slug: 'hijos', idKey: 'id_hijo', codeWidth: 0, entity: 'un hijo', scope: 'tenant', seed: 'hijos', messages: { style: 'M1' }, fields, columns: [{ key: 'id_hijo', header: 'C' }], ...over },
    ],
  ).bySlug.get('hijos');

describe('UI adapter: select over a registry catalog (G1)', () => {
  it('maps the select to its source catalog, with the static where as string filters', () => {
    const config = toCatalogConfig(entry([{ name: 'id_padre', kind: 'select', label: 'Padre', required: true, source: { catalog: 'padres', where: { estado: true, tipo: 'A' } } }]));
    expect(config.fields).toEqual([{ kind: 'select', name: 'id_padre', label: 'Padre', required: true, source: { catalog: 'padres', where: { estado: 'true', tipo: 'A' } } }]);
  });

  it('an optional select without a where has no filters', () => {
    const [field] = toCatalogConfig(entry([{ name: 'id_padre', kind: 'select', label: 'Padre', source: { catalog: 'padres' } }])).fields;
    expect(field).toMatchObject({ kind: 'select', required: false, source: { catalog: 'padres', where: undefined } });
  });
});
