import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, required: true, max: 10 });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion')], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const exists = (over: Record<string, any> = {}) => ({ id_sede: { exists: { catalog: 'asignaciones', local: 'id_tipo', where: { estado: 'A' }, ...over } } });
const pair = (filters: Record<string, any>) => [
  entry('series', { lookupFilters: filters }),
  entry('asignaciones', { fields: [text('id_tipo'), text('id_sede'), text('estado')] }),
];

const REJECTED: [string, Record<string, any>, RegExp][] = [
  ['an unknown catalog', exists({ catalog: 'nope' }), /lookupFilters names unknown catalog "nope"/],
  ['a local field the catalog lacks', exists({ local: 'nope' }), /lookupFilters names unknown field "nope" of "asignaciones"/],
  ['a where field the catalog lacks', exists({ where: { nope: 'A' } }), /lookupFilters names unknown field "nope" of "asignaciones"/],
  ['a filter key the catalog lacks', { id_zona: exists().id_sede }, /lookupFilters names unknown field "id_zona" of "asignaciones"/],
  ['an exists without a local field', exists({ local: undefined }), /exists needs a catalog and a local field/],
];

describe('the exists lookup filter in the registry (R-MOCK-16)', () => {
  it.each(REJECTED)('rejects %s', (_name, filters, message) => {
    expect(() => validateRegistry(pair(filters))).toThrow(message);
  });

  it('accepts a filter whose key, local field and where all exist in the catalog; the filter key may be renamed with `key`', () => {
    expect(() => validateRegistry(pair(exists()))).not.toThrow();
    expect(() => validateRegistry(pair({ id_zona: exists({ key: 'id_sede' }).id_sede }))).not.toThrow();
  });
});
