import { describe, expect, it } from 'vitest';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { blurNormalize, normalize } from './normalize';

const serie: FieldConfig = { kind: 'text', name: 'serie', label: 'Serie', normalize: ['upper', 'padLeft:4'], uppercase: true };
const nota: FieldConfig = { kind: 'text', name: 'nota', label: 'Nota', normalize: ['upper'] };
const hora: FieldConfig = { kind: 'number', name: 'hora', label: 'Hora', scale: 0, maxLength: 2, normalize: ['digits', 'padLeft:2'] };
const dias: FieldConfig = { kind: 'number', name: 'dias_pago', label: 'Dias de Pago', scale: 0, maxLength: 2, normalize: ['digits'] };

describe('S-CRUD-35 padLeft on blur', () => {
  it.each([
    [serie, 'f1', '00F1'],
    [serie, '', ''],
    [serie, '  ', ''],
    [serie, 'ab12', 'AB12'],
    [hora, '5', '05'],
    [hora, '12', '12'],
    [hora, '', ''],
  ])('%j blurred with %j shows %j', (field, typed, shown) => {
    expect(blurNormalize(field, typed)).toBe(shown);
  });

  it('leaves a field with no padLeft step exactly as typed (no trim, no case change on blur)', () => {
    expect(blurNormalize(nota, ' ab ')).toBe(' ab ');
    expect(blurNormalize(dias, '7')).toBe('7');
  });

  it('ignores fields that cannot be padded', () => {
    expect(blurNormalize({ kind: 'boolean', name: 'x', label: 'X' }, 'true')).toBe('true');
  });
});

describe('number fields in the payload (codec, D7)', () => {
  it('pads a padLeft integer on submit and keeps it a string: 05 is an identifier-like value', () => {
    expect(normalize([hora], { hora: '5' })).toEqual({ hora: '05' });
  });

  it('sends a plain integer as a number, and 0 stays 0', () => {
    expect(normalize([dias], { dias_pago: '30' })).toEqual({ dias_pago: 30 });
    expect(normalize([dias], { dias_pago: '0' })).toEqual({ dias_pago: 0 });
  });

  it('keeps a blank integer blank', () => {
    expect(normalize([dias], { dias_pago: '' })).toEqual({ dias_pago: '' });
  });
});
