import { describe, expect, it } from 'vitest';
import { PRESETS } from './presets.js';
import { validateRegistry } from './schema.js';

const base = (extra: Record<string, any>[] = [], over: Record<string, any> = {}): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things',
  messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }, ...extra],
  columns: [{ key: 'descripcion', header: 'Descripción' }], ...over,
});
const flag = (over: Record<string, any>) => base([{ name: 'flag', kind: 'boolean', label: 'Flag', ...over }]);

const tipo = (over: Record<string, any> = {}) =>
  base([{ name: 'tipo', kind: 'options', label: 'Tipo', display: 'radio', options: [{ value: 'E', label: 'Entrada' }, { value: 'S', label: 'Salida' }], ...over }]);

describe('options fields are validated at load (R-REG-2, R-MOCK-14)', () => {
  it.each([
    ['an unknown display', tipo({ display: 'dropdown' }), /field "tipo".*unknown display "dropdown"/],
    ['an option without a label', tipo({ options: [{ value: 'E' }] }), /field "tipo".*every option needs a value and a label/],
    ['a duplicated option value', tipo({ options: [{ value: 'E', label: 'A' }, { value: 'E', label: 'B' }] }), /field "tipo".*duplicate option value "E"/],
    ['a default outside the list', tipo({ default: 'Z' }), /field "tipo".*default "Z" is not one of the options/],
    ['a per-mode default outside the list', tipo({ default: { INSERT: 'Z' } }), /field "tipo".*default "Z" is not one of the options/],
    ['a label column for a field that is not an options field', base([], { columns: [{ key: 'descripcion_label', header: 'D' }] }), /column "descripcion_label".*no options field "descripcion"/],
  ])('rejects %s', (_name, entry, message) => {
    expect(() => validateRegistry([entry])).toThrow(message);
  });

  it('accepts options with a display, a default and the <name>_label column', () => {
    const entry = validateRegistry([
      base([{ name: 'tipo', kind: 'options', label: 'Tipo', display: 'select', default: 'E', options: [{ value: 'E', label: 'Entrada' }] }], {
        columns: [{ key: 'descripcion', header: 'D' }, { key: 'tipo_label', header: 'Tipo' }],
      }),
    ]).bySlug.get('things');
    expect(entry.fields[1]).toMatchObject({ display: 'select', default: 'E' });
  });

  it('display defaults to select when omitted', () => {
    expect(validateRegistry([tipo({ display: undefined })]).bySlug.get('things').fields[1].display).toBe('select');
  });
});

describe('field behavior attributes are validated at load (R-REG-4, D15)', () => {
  it.each([
    ['readOnlyOn names an unknown mode', flag({ readOnlyOn: ['INSERT', 'FLY'] }), /field "flag".*readOnlyOn.*unknown mode "FLY"/],
    ['a per-mode default names an unknown mode', flag({ default: { FLY: true } }), /field "flag".*default.*unknown mode "FLY"/],
    ['a column has an unknown type', base([], { columns: [{ key: 'descripcion', header: 'D', type: 'blob' }] }), /column "descripcion".*unknown type "blob"/],
  ])('rejects: %s', (_name, entry, message) => {
    expect(() => validateRegistry([entry])).toThrow(message);
  });

  it('accepts readOnlyOn, scalar and per-mode defaults and bool columns', () => {
    const registry = validateRegistry([
      base([{ name: 'flag', kind: 'boolean', label: 'Flag', default: { INSERT: true }, readOnlyOn: ['INSERT', 'DETAIL'] }], {
        columns: [{ key: 'descripcion', header: 'D' }, { key: 'flag', header: 'Flag', type: 'bool' }],
      }),
    ]);
    expect(registry.bySlug.get('things').fields[1]).toMatchObject({ default: { INSERT: true }, readOnlyOn: ['INSERT', 'DETAIL'] });
  });

  it('R-REF-3 the estado preset is true on INSERT and read-only on INSERT, CLONE, DETAIL and DELETE', () => {
    const entry = validateRegistry([base([{ name: 'estado', preset: 'estado' }])]).bySlug.get('things');
    expect(entry.fields[1]).toMatchObject({
      name: 'estado', kind: 'boolean', label: 'Activo', default: { INSERT: true }, readOnlyOn: ['INSERT', 'CLONE', 'DETAIL', 'DELETE'],
    });
    expect(Object.keys(PRESETS)).toContain('estado');
  });
});
