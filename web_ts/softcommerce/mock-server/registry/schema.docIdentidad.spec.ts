import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

/** `maxWhen` and the entry `rules` params in the registry (R-REG-2, R-REG-4, S-REG-16). */
const tipo = { name: 'tipo', kind: 'options', label: 'Tipo', display: 'select', options: [{ value: '01', label: 'DNI' }, { value: '05', label: 'RUC' }] };
const base = (...fields: Record<string, any>[]): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }, tipo, ...fields],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
});
const numero = (over: Record<string, any> = {}) => ({ name: 'numero', kind: 'text', label: 'Número', max: 11, maxWhen: [{ when: { field: 'tipo', in: ['01'] }, len: 8 }], ...over });
const person = (params: Record<string, any>, over: Record<string, any> = {}) => ({
  ...base(numero(), { name: 'pat', kind: 'text', label: 'Paterno', max: 5 }, { name: 'mat', kind: 'text', label: 'Materno', max: 5 }, { name: 'nom', kind: 'text', label: 'Nombres', max: 5 }),
  rules: [{ name: 'docIdentidad', params: { tipo: 'tipo', numero: 'numero', paterno: 'pat', materno: 'mat', nombres: 'nom', razon: 'descripcion', ...params } }],
  ...over,
});

const REJECTED: [string, Record<string, any>, RegExp][] = [
  ['maxWhen that is not a list', base(numero({ maxWhen: { when: { field: 'tipo', in: ['01'] }, len: 8 } })), /field "numero".*maxWhen must be a list/],
  ['maxWhen on a number field', base({ name: 'n', kind: 'number', label: 'N', scale: 0, maxWhen: [{ when: { field: 'tipo', in: ['01'] }, len: 8 }] }), /field "n".*maxWhen needs a text field/],
  ['a maxWhen len that is not a positive integer', base(numero({ maxWhen: [{ when: { field: 'tipo', in: ['01'] }, len: 0 }] })), /field "numero".*maxWhen len must be a positive integer/],
  ['a maxWhen len above max', base(numero({ maxWhen: [{ when: { field: 'tipo', in: ['01'] }, len: 12 }] })), /field "numero".*maxWhen len 12 is above max 11/],
  ['a maxWhen naming an unknown field', base(numero({ maxWhen: [{ when: { field: 'nope', in: ['01'] }, len: 8 }] })), /maxWhen names unknown field "nope"/],
  ['a maxWhen without values', base(numero({ maxWhen: [{ when: { field: 'tipo' }, len: 8 }] })), /field "numero".*maxWhen needs a condition/],
  ['a rule param naming an unknown field', person({ razon: 'nope' }), /rule "docIdentidad".*names unknown field "nope"/],
  ['a rule param that is not a name', person({ numero: 5 }), /rule "docIdentidad".*numero must be a field name/],
  ['an unknown rule param', person({ extra: 'x' }), /rule "docIdentidad".*unknown param "extra"/],
  ['a persona column that is also a field', person({ persona: 'numero' }), /rule "docIdentidad".*persona "numero" is also a field/],
  ['a persona column that is also a constant', person({ persona: 'flag' }, { constants: { flag: 'N' } }), /rule "docIdentidad".*persona "flag" is also a constant/],
  ['a tipo that is not a select or options field', person({ tipo: 'numero' }), /rule "docIdentidad".*tipo must be a select or options field/],
  ['a names param that is not a text field', person({ nombres: 'tipo' }), /rule "docIdentidad".*nombres must be a text field/],
  ['an unknown rule', { ...person({}), rules: [{ name: 'nope' }] }, /unknown rule "nope"/],
];

describe('maxWhen and rule params in the registry', () => {
  it.each(REJECTED)('rejects %s', (_name, entry, message) => {
    expect(() => validateRegistry([entry])).toThrow(message);
  });

  it('accepts a conditional max and a docIdentidad rule over named fields', () => {
    expect(() => validateRegistry([base(numero())])).not.toThrow();
    expect(() => validateRegistry([person({ persona: 'flag' })])).not.toThrow();
  });

  it('S-REG-16 a rule step needs the rule on the entry', () => {
    expect(() => validateRegistry([person({}, { validation: ['tipo', { rule: 'docIdentidad' }] })])).not.toThrow();
    expect(() => validateRegistry([{ ...person({}), rules: undefined, validation: ['tipo', { rule: 'docIdentidad' }] }])).toThrow(/unknown rule "docIdentidad"/);
  });

  it('a field a rule touches carries its rule state for the form and the server', () => {
    const entry = validateRegistry([person({})]).bySlug.get('things');
    const field = (name: string) => entry.fields.find((f: any) => f.name === name);
    expect(field('descripcion').ruleState({ tipo: '01' })).toEqual({ hidden: true });
    expect(field('numero').ruleState({ tipo: '01' })).toEqual({ max: 8 });
    expect(field('tipo').ruleState).toBeUndefined();
    // Not an own enumerable key: a registry entry stays plain data to compare and serialize.
    expect(Object.keys(field('numero'))).not.toContain('ruleState');
  });
});
