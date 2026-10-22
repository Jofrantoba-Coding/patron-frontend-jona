import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

const base = (...fields: Record<string, any>[]): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }, ...fields],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
});
const hora = (over: Record<string, any> = {}) => ({
  name: 'hora', kind: 'number', label: 'Hora', scale: 0, max: 2, range: { min: 0, max: 12 }, messages: { range: 'Para {modo}, debes Insertar Hora Correcto.' }, ...over,
});

const REJECTED: [string, Record<string, any>, RegExp][] = [
  ['a range without its literal message', base(hora({ messages: undefined })), /field "hora".*range needs messages.range/],
  ['a range whose min is above its max', base(hora({ range: { min: 13, max: 12 } })), /field "hora".*range min 13 is above max 12/],
  ['a range with a non-numeric bound', base(hora({ range: { min: '0' } })), /field "hora".*range bounds must be numbers/],
  ['a range on a text field', base({ name: 'x', kind: 'text', label: 'X', range: { min: 0 } }), /field "x".*range needs a number field/],
  ['a digit count that is not a positive integer', base(hora({ max: 0 })), /field "hora".*max must be a positive integer/],
];

describe('integer number fields in the registry (R-REG-2, R-CRUD-11)', () => {
  it.each(REJECTED)('rejects %s', (_name, entry, message) => {
    expect(() => validateRegistry([entry])).toThrow(message);
  });

  it('rejects a {range} step that names a field without a range', () => {
    const entry = { ...base({ name: 'n', kind: 'number', label: 'N', scale: 0, max: 2 }), validation: ['descripcion', { range: 'n' }] };
    expect(() => validateRegistry([entry])).toThrow(/range step names "n", which has no range/);
  });

  it('rejects a {range} step that names an unknown field', () => {
    const entry = { ...base(hora()), validation: ['descripcion', { range: 'ghost' }] };
    expect(() => validateRegistry([entry])).toThrow(/range step names "ghost"/);
  });

  it('accepts a ranged integer and keeps the declared steps', () => {
    const entry = { ...base(hora()), validation: ['descripcion', 'hora', { range: 'hora' }] };
    expect(validateRegistry([entry]).entries[0].steps).toEqual(['descripcion', 'hora', { range: 'hora' }]);
  });
});
