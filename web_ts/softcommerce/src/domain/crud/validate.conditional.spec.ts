import { describe, expect, it } from 'vitest';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { validate } from './validate';

const TICKET = { field: 'tipo', in: ['TI'] };
const fields: FieldConfig[] = [
  { kind: 'text', name: 'tipo', label: 'Tipo' },
  { kind: 'text', name: 'nota', label: 'Nota', visibleWhen: TICKET, requiredWhen: TICKET },
  { kind: 'text', name: 'obs', label: 'Obs', required: true, enabledWhen: { field: 'tipo', in: ['01'] } },
  { kind: 'text', name: 'corto', label: 'Corto', visibleWhen: TICKET, minLen: 3 },
  { kind: 'text', name: 'largo', label: 'Largo', visibleWhen: TICKET, maxLength: 2 },
];

describe('validate skips hidden and disabled fields (R-CRUD-5, R-CRUD-13)', () => {
  it('requiredWhen makes a visible field required', () => {
    expect(validate(fields, { tipo: 'TI', nota: '', obs: '' }).map((e) => e.name)).toEqual(['nota']);
  });

  it('a hidden field is not validated at all', () => {
    expect(validate(fields, { tipo: '01', nota: '', obs: 'x', corto: 'a', largo: 'abcd' })).toEqual([]);
  });

  it('a disabled field is not validated even when it is required', () => {
    expect(validate(fields, { tipo: 'TI', nota: 'x', obs: '', corto: 'abc', largo: 'ab' })).toEqual([]);
  });

  it('an enabled required field blocks', () => {
    expect(validate(fields, { tipo: '01', obs: '' }).map((e) => e.name)).toEqual(['obs']);
  });

  it('length rules apply only while the field is visible', () => {
    expect(validate(fields, { tipo: 'TI', nota: 'x', corto: 'a', largo: 'ab' }).map((e) => e.name)).toEqual(['corto']);
  });
});
