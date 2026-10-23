import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

const base = (...fields: Record<string, any>[]): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }, ...fields],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
});
const monto = (over: Record<string, any> = {}) => ({ name: 'monto', kind: 'number', label: 'Monto', scale: 2, exclusiveMin: 0, default: '0.0', blankToDefault: true, ...over });

const REJECTED: [string, Record<string, any>, RegExp][] = [
  ['a non-numeric min', base(monto({ min: '0' })), /field "monto".*min must be a number/],
  ['a non-numeric exclusiveMin', base(monto({ exclusiveMin: 'x' })), /field "monto".*exclusiveMin must be a number/],
  ['a default that is not a number', base(monto({ default: 'abc' })), /field "monto".*default "abc" is not a number/],
  ['blankToDefault without a default', base(monto({ default: undefined })), /field "monto".*blankToDefault needs a default/],
  ['min on a text field', base({ name: 'x', kind: 'text', label: 'X', min: 0 }), /field "x".*min needs a number or date field/],
  ['exclusiveMin on a text field', base({ name: 'x', kind: 'text', label: 'X', exclusiveMin: 0 }), /field "x".*exclusiveMin needs a number field/],
  ['a dec column on an unknown type', { ...base(), columns: [{ key: 'descripcion', header: 'D', type: 'money' }] }, /column "descripcion" has unknown type "money"/],
];

describe('decimal number fields in the registry (R-REG-2, R-CRUD-11)', () => {
  it.each(REJECTED)('rejects %s', (_name, entry, message) => {
    expect(() => validateRegistry([entry])).toThrow(message);
  });

  it('accepts a decimal with bounds, a default and blankToDefault, and a dec column', () => {
    const entry = { ...base(monto()), columns: [{ key: 'monto', header: 'Monto', type: 'dec' }] };
    expect(() => validateRegistry([entry])).not.toThrow();
  });

  it('accepts a negative min and a numeric default given as a number', () => {
    expect(() => validateRegistry([base(monto({ min: -5, exclusiveMin: undefined, default: 0 }))])).not.toThrow();
  });
});
