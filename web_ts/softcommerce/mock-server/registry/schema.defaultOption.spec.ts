import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

const parent = { name: 'tipo', kind: 'options', label: 'Tipo', display: 'select', options: [{ value: 'E', label: 'E' }] };
const child = (over: Record<string, any> = {}) => ({
  name: 'id_clasif', kind: 'select', label: 'Clasificacion', source: { catalog: 'clasifs' }, dependsOn: [{ field: 'tipo', filterKey: 'tipo' }], defaultOption: 'first', ...over,
});
const entry = (...fields: Record<string, any>[]): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }, ...fields],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
});
const clasifs = { slug: 'clasifs', idKey: 'id_c', codeWidth: 0, entity: 'una clasif', scope: 'tenant', seed: 'clasifs', messages: { style: 'M1' }, fields: [{ name: 'tipo', kind: 'text', label: 'T', max: 1 }], columns: [{ key: 'tipo', header: 'T' }] };

const REJECTED: [string, Record<string, any>, RegExp][] = [
  ['a defaultOption other than first', entry(parent, child({ defaultOption: 'last' })), /field "id_clasif".*defaultOption must be "first"/],
  ['a defaultOption on a text field', entry({ name: 'x', kind: 'text', label: 'X', max: 3, defaultOption: 'first' }), /field "x".*defaultOption needs a select field/],
  ['a defaultOption on a select with no parent', entry(child({ dependsOn: undefined })), /field "id_clasif".*defaultOption needs a dependsOn parent/],
];

describe('defaultOption in the registry (R-CRUD-11, R-REG-4)', () => {
  it.each(REJECTED)('rejects %s', (_name, raw, message) => {
    expect(() => validateRegistry([raw, clasifs])).toThrow(message);
  });

  it('accepts defaultOption first on a dependent select', () => {
    const registry = validateRegistry([entry(parent, child()), clasifs]);
    expect(registry.bySlug.get('things').fields.find((f: any) => f.name === 'id_clasif').defaultOption).toBe('first');
  });
});
