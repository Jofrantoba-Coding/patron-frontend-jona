import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

const base = (...fields: Record<string, any>[]): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }, ...fields],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
});
const ruc = (over: Record<string, any> = {}) => ({ name: 'ruc', kind: 'text', label: 'RUC', max: 11, minLen: 11, ...over });
const when = (over: Record<string, any> = {}) => ({ when: { field: 'descripcion', in: ['X'] }, len: 3, ...over });

const REJECTED: [string, Record<string, any>, RegExp][] = [
  ['a minLen that is not a positive integer', base(ruc({ minLen: 0 })), /field "ruc".*minLen must be a positive integer/],
  ['a fractional minLen', base(ruc({ minLen: 1.5 })), /field "ruc".*minLen must be a positive integer/],
  ['a minLen above max', base(ruc({ minLen: 12 })), /field "ruc".*minLen 12 is above max 11/],
  ['minLen on a number field', base({ name: 'n', kind: 'number', label: 'N', scale: 0, minLen: 2 }), /field "n".*minLen needs a text field/],
  ['minLenWhen on an options field', base({ name: 'o', kind: 'options', label: 'O', options: [{ value: 'a', label: 'A' }], minLenWhen: [when()] }), /field "o".*minLenWhen needs a text field/],
  ['minLenWhen that is not a list', base(ruc({ minLen: undefined, minLenWhen: when() })), /field "ruc".*minLenWhen must be a list/],
  ['a rule without a positive len', base(ruc({ minLen: undefined, minLenWhen: [when({ len: -1 })] })), /field "ruc".*minLenWhen len must be a positive integer/],
  ['a rule above max', base(ruc({ minLen: undefined, minLenWhen: [when({ len: 12 })] })), /field "ruc".*minLenWhen len 12 is above max 11/],
  ['a rule naming an unknown field', base(ruc({ minLen: undefined, minLenWhen: [when({ when: { field: 'nope', in: ['X'] } })] })), /minLenWhen names unknown field "nope"/],
  ['a rule without values', base(ruc({ minLen: undefined, minLenWhen: [when({ when: { field: 'descripcion' } })] })), /field "ruc".*minLenWhen needs a condition/],
];

describe('minLen and minLenWhen in the registry (R-REG-4)', () => {
  it.each(REJECTED)('rejects %s', (_name, entry, message) => {
    expect(() => validateRegistry([entry])).toThrow(message);
  });

  it('accepts an exact length and a conditional one', () => {
    expect(() => validateRegistry([base(ruc())])).not.toThrow();
    expect(() => validateRegistry([base(ruc({ minLen: undefined, minLenWhen: [when({ len: 5 })] }))])).not.toThrow();
  });
});
