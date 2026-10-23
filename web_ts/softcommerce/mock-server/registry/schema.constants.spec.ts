import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

const base = (over: Record<string, any> = {}): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [{ name: 'imprime', kind: 'options', label: 'Imprime', display: 'radio', options: [{ value: 'S', label: 'Sí' }, { value: 'N', label: 'No' }] }],
  columns: [{ key: 'imprime', header: 'Imprime' }],
  ...over,
});
const derive = (over: Record<string, any> = {}) => ({ target: 'lineas', when: { field: 'imprime', in: ['S'] }, then: 12, else: 0, ...over });

const REJECTED: [string, Record<string, any>, RegExp][] = [
  ['constants that is not an object', base({ constants: ['a'] }), /constants must be an object/],
  ['a constant that is not a plain value', base({ constants: { a: { b: 1 } } }), /constant "a" must be a string, number or boolean/],
  ['a constant named like a field', base({ constants: { imprime: 'S' } }), /constant "imprime" is also a field/],
  ['derive that is not a list', base({ derive: derive() }), /derive must be a list/],
  ['a derive without a target', base({ derive: [derive({ target: undefined })] }), /derive needs a target/],
  ['a derive target named like a field', base({ derive: [derive({ target: 'imprime' })] }), /derive target "imprime" is also a field/],
  ['a derive target named like a constant', base({ constants: { lineas: 1 }, derive: [derive()] }), /derive target "lineas" is also a constant/],
  ['a derive condition on an unknown field', base({ derive: [derive({ when: { field: 'nope', in: ['S'] } })] }), /derive names unknown field "nope"/],
  ['a derive condition without values', base({ derive: [derive({ when: { field: 'imprime' } })] }), /derive needs a condition/],
  ['a derive without both branches', base({ derive: [derive({ else: undefined })] }), /derive needs then and else/],
];

describe('constants and derive in the registry (R-REG-2)', () => {
  it.each(REJECTED)('rejects %s', (_name, entry, message) => {
    expect(() => validateRegistry([entry])).toThrow(message);
  });

  it('accepts stored constants and a derived value', () => {
    expect(() => validateRegistry([base({ constants: { num_inicial: '0000000001', flag: 'N', n: 3, ok: true }, derive: [derive()] })])).not.toThrow();
  });
});
