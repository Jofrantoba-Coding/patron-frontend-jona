import { describe, expect, it } from 'vitest';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { decodeValue, encodeValue, encodeValues } from './codec';

const flag: FieldConfig = { kind: 'boolean', name: 'hab_guia', label: 'Hab Guia' };
const text: FieldConfig = { kind: 'text', name: 'descripcion', label: 'Descripción' };

describe('per-kind codec (D7): form state is a string, the wire is typed', () => {
  it.each([
    [true, 'true'],
    [false, 'false'],
    [undefined, 'false'],
    [null, 'false'],
  ])('decodes the boolean %s as "%s"', (wire, form) => {
    expect(decodeValue(flag, wire)).toBe(form);
  });

  it.each([['true', true], ['false', false], ['', false]])('encodes the boolean form value "%s" as %s', (form, wire) => {
    expect(encodeValue(flag, form)).toBe(wire);
  });

  it('text passes through both ways, and a missing text decodes to empty', () => {
    expect(decodeValue(text, 'ROJO')).toBe('ROJO');
    expect(decodeValue(text, undefined)).toBe('');
    expect(encodeValue(text, 'ROJO')).toBe('ROJO');
  });

  it('an options field keeps its code as a string both ways', () => {
    const tipo: FieldConfig = { kind: 'options', name: 'tipo', label: 'Tipo', display: 'radio', options: [{ value: 'E', label: 'Entrada' }] };
    expect(decodeValue(tipo, 'E')).toBe('E');
    expect(decodeValue(tipo, undefined)).toBe('');
    expect(encodeValue(tipo, 'E')).toBe('E');
  });

  it('encodes a whole form, leaving unknown keys alone', () => {
    expect(encodeValues([text, flag], { descripcion: 'X', hab_guia: 'true', extra: 'e' })).toEqual({ descripcion: 'X', hab_guia: true, extra: 'e' });
  });
});
