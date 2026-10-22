import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

/** Smallest valid entry; each row below breaks exactly one rule on a copy of it. */
const base = (over: Record<string, any> = {}): Record<string, any> => ({
  slug: 'things',
  idKey: 'id_thing',
  codeWidth: 0,
  entity: 'una cosa',
  scope: 'tenant',
  seed: 'things',
  messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
  ...over,
});
const withFields = (...extra: Record<string, any>[]) => base({ fields: [...base().fields, ...extra] });
const other = (over: Record<string, any>) => base({ slug: 'others', idKey: 'id_other', seed: 'others', ...over });

const REJECTED: [string, Record<string, any>[], RegExp][] = [
  ['S-REG-3 duplicate slug', [base(), base({ idKey: 'id_b' })], /duplicate slug "things"/],
  ['duplicate idKey', [base(), other({ idKey: 'id_thing' })], /duplicate idKey "id_thing"/],
  ['duplicate formId', [base({ formId: 'mi_a' }), other({ formId: 'mi_a' })], /duplicate formId "mi_a"/],
  ['S-REG-4 unknown source', [withFields({ name: 'x', kind: 'select', label: 'X', source: { catalog: 'nope' } })], /field "x".*unknown catalog "nope"/],
  [
    'S-REG-5 cyclic dependsOn',
    [withFields(
      { name: 'a', kind: 'select', label: 'A', source: { catalog: 'empresas' }, dependsOn: [{ field: 'b', filterKey: 'k' }] },
      { name: 'b', kind: 'select', label: 'B', source: { catalog: 'empresas' }, dependsOn: [{ field: 'a', filterKey: 'k' }] },
    )],
    /cyclic dependsOn/,
  ],
  ['S-REG-16 unknown named rule', [base({ rules: [{ name: 'nope' }] })], /unknown rule "nope"/],
  ['S-REG-16 unique step out of range', [base({ validation: ['descripcion', { unique: 3 }] })], /unique step 3/],
  ['unknown rule step', [base({ validation: [{ rule: 'nope' }] })], /unknown rule "nope"/],
  ['unknown ref step', [base({ validation: [{ ref: 'descripcion' }] })], /ref step.*"descripcion"/],
  ['unknown field step', [base({ validation: ['ghost'] })], /unknown field "ghost"/],
  ['unknown dependsOn field', [withFields({ name: 'x', kind: 'select', label: 'X', source: { catalog: 'empresas' }, dependsOn: [{ field: 'ghost', filterKey: 'k' }] })], /dependsOn.*unknown field "ghost"/],
  ['unknown visibleWhen field', [withFields({ name: 'x', kind: 'text', label: 'X', visibleWhen: { field: 'ghost', in: ['A'] } })], /visibleWhen.*unknown field "ghost"/],
  ['unknown enabledWhen field', [withFields({ name: 'x', kind: 'text', label: 'X', enabledWhen: { field: 'ghost', in: ['A'] } })], /enabledWhen.*unknown field "ghost"/],
  ['unknown requiredWhen field', [withFields({ name: 'x', kind: 'text', label: 'X', requiredWhen: { field: 'ghost', in: ['A'] } })], /requiredWhen.*unknown field "ghost"/],
  ['unknown afterField', [withFields({ name: 'x', kind: 'date', label: 'X', afterField: 'ghost' })], /afterField.*unknown field "ghost"/],
  ['unknown unique field', [base({ unique: [{ fields: ['ghost'], errorField: 'descripcion', message: 'm' }] })], /unique.*unknown field "ghost"/],
  ['unknown unique errorField', [base({ unique: [{ fields: ['descripcion'], errorField: 'ghost', message: 'm' }] })], /unique.*unknown field "ghost"/],
  ['unknown join ref', [base({ joins: [{ as: 'j', ref: 'ghost', display: 'name' }] })], /joins.*unknown field "ghost"/],
  ['bad scope', [base({ scope: 'global' })], /unknown scope "global"/],
  ['bad messages style', [base({ messages: { style: 'X9' } })], /unknown messages style "X9"/],
  ['bad mode', [base({ modes: ['INSERT', 'FLY'] })], /unknown mode "FLY"/],
  ['bad stamp', [base({ stamp: ['id_nope'] })], /unknown stamp "id_nope"/],
  ['select without source', [withFields({ name: 'x', kind: 'select', label: 'X' })], /field "x".*needs a source/],
  ['options without values', [withFields({ name: 'x', kind: 'options', label: 'X' })], /field "x".*needs options/],
  ['number without scale', [withFields({ name: 'x', kind: 'number', label: 'X' })], /field "x".*needs a scale/],
  ['unknown kind', [withFields({ name: 'x', kind: 'color', label: 'X' })], /field "x".*unknown kind "color"/],
  ['unknown preset', [withFields({ name: 'x', kind: 'boolean', label: 'X', preset: 'nope' })], /unknown preset "nope"/],
  ['unknown lookup filter rule', [base({ lookupFilters: { k: { rule: 'nope' } } })], /unknown rule "nope"/],
  ['bad seed', [base({ seed: 7 })], /seed/],
  ['unknown normalize step', [withFields({ name: 'x', kind: 'text', label: 'X', normalize: ['upper', 'title'] })], /field "x".*unknown normalize step "title"/],
  ['unknown optionLabel field', [base({ optionLabel: 'ghost' })], /optionLabel.*unknown field "ghost"/],
  ['padLeft needs a width', [withFields({ name: 'x', kind: 'text', label: 'X', normalize: ['padLeft'] })], /unknown normalize step "padLeft"/],
];

describe('validateRegistry (R-REG-4 fail fast at load)', () => {
  it.each(REJECTED)('%s', (_name, entries, message) => {
    expect(() => validateRegistry(entries)).toThrow(message);
  });

  it('accepts a valid entry and derives section, modes, refs and validation steps', () => {
    const registry = validateRegistry([
      withFields({ name: 'id_empresa', kind: 'select', label: 'Empresa', source: { catalog: 'empresas' } }),
    ]);
    const entry = registry.bySlug.get('things');
    expect(entry).toMatchObject({ section: 'things', modes: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] });
    expect(entry.refs).toEqual([{ field: 'id_empresa', catalog: 'empresas', where: {}, activeOnly: true, parents: [] }]);
    expect(entry.steps).toEqual(['descripcion', 'id_empresa', { ref: 'id_empresa' }]);
  });

  it('accepts a legacy W1 entry whose seed lives in a W1 section (seed: null)', () => {
    expect(() => validateRegistry([base({ seed: null })])).not.toThrow();
  });
});
