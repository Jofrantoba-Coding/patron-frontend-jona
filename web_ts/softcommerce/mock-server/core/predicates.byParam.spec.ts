import { describe, expect, it } from 'vitest';
import { effectiveField } from './predicates.js';

const zona = { name: 'id_zona', kind: 'select', byParam: { param: 'IS_DIRECCION_CLIENTE', in: [false], set: { required: true } } };

describe('effectiveField: a field that changes with a company parameter (R-MST-11)', () => {
  it('takes the declared overrides while the parameter holds a listed value', () => {
    expect(effectiveField(zona, { IS_DIRECCION_CLIENTE: false })).toMatchObject({ name: 'id_zona', required: true });
  });

  it('is the field itself while the parameter holds another value or is missing', () => {
    expect(effectiveField(zona, { IS_DIRECCION_CLIENTE: true })).toBe(zona);
    expect(effectiveField(zona, {})).toBe(zona);
    expect(effectiveField(zona, undefined)).toBe(zona);
  });

  it('a field with no byParam is returned as is, and a bare param needs it true', () => {
    const plain = { name: 'x', kind: 'text' };
    expect(effectiveField(plain, { IS_DIRECCION_CLIENTE: false })).toBe(plain);
    expect(effectiveField({ name: 'y', byParam: { param: 'ISBOTICA', set: { required: true } } }, { ISBOTICA: true })).toMatchObject({ required: true });
  });
});
