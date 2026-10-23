import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { toCatalogConfig } from '../../catalogs/registry';
import { decodeValue, encodeValue, encodeValues } from './codec';
import { formatRows } from './listView';
import { initialValues } from './modeDefaults';
import { blurNormalize } from './normalize';
import { validate } from './validate';

const monto: FieldConfig = { kind: 'number', name: 'monto', label: 'Monto', scale: 2, default: '0.0', blankToDefault: true, exclusiveMin: 0 };

describe('codec: decimal fields (D7, S-CRUD-25)', () => {
  it('decodes the stored number to its string as stored, with no rounding', () => {
    expect(decodeValue(monto, 3.4567)).toBe('3.4567');
    expect(decodeValue(monto, 0)).toBe('0');
    expect(decodeValue(monto, undefined)).toBe('');
  });

  it('encodes a complete decimal as a number', () => {
    expect(encodeValue(monto, '3.4567')).toBe(3.4567);
    expect(encodeValue(monto, '-3')).toBe(-3);
    expect(encodeValue(monto, '0.0')).toBe(0);
  });

  it.each(['', '  ', '-', '.', '1.', '-.5'])('leaves the incomplete value "%s" as the string it is, for the rules to judge', (text) => {
    expect(encodeValue(monto, text)).toBe(text);
  });

  it('a number the wire cannot hold exactly stays a string, so nothing is silently rounded', () => {
    expect(encodeValue(monto, '0.1234567890123456789')).toBe('0.1234567890123456789');
    expect(encodeValues([monto], { monto: '2.5' })).toEqual({ monto: 2.5 });
  });
});

describe('S-CRUD-26 blankToDefault on blur', () => {
  it('a blank decimal shows its default when focus leaves', () => {
    expect(blurNormalize(monto, '')).toBe('0.0');
    expect(blurNormalize(monto, '   ')).toBe('0.0');
  });

  it('a filled decimal is left exactly as typed', () => {
    expect(blurNormalize(monto, '1.50')).toBe('1.50');
  });

  it('without blankToDefault a blank stays blank', () => {
    expect(blurNormalize({ ...monto, blankToDefault: false }, '')).toBe('');
  });

  it('INSERT starts with the default text', () => {
    expect(initialValues([monto], 'INSERT')).toEqual({ monto: '0.0' });
  });
});

describe('S-CRUD-25 the min and exclusiveMin rules reject on submit', () => {
  const entry = (over: Record<string, any>) =>
    toCatalogConfig(
      validateRegistry([
        {
          slug: 'montos', idKey: 'id_monto', codeWidth: 0, entity: 'un Monto', scope: 'tenant', seed: 'montos', messages: { style: 'M1' },
          fields: [{ name: 'monto', kind: 'number', label: 'Monto', scale: 2, required: true, ...over }], columns: [{ key: 'monto', header: 'M' }],
        },
      ]).entries[0],
    );
  const run = (config: ReturnType<typeof entry>, value: string) => validate(config.fields, { monto: value }, { entry: config.entry!, mode: 'INSERT' });

  it('-3 is accepted by the input but rejected by exclusiveMin 0, with the required text', () => {
    expect(run(entry({ exclusiveMin: 0 }), '-3').map((e) => [e.name, e.message])).toEqual([['monto', 'Para agregar un Monto, debes especificar su Monto.']]);
  });

  it('exclusiveMin rejects 0 and accepts a tiny positive', () => {
    const config = entry({ exclusiveMin: 0 });
    expect(run(config, '0.0')).toHaveLength(1);
    expect(run(config, '0.0001')).toEqual([]);
  });

  it('min is inclusive', () => {
    const config = entry({ min: 1 });
    expect(run(config, '1')).toEqual([]);
    expect(run(config, '0.99')).toHaveLength(1);
  });

  it('an incomplete number is invalid, not a bound error', () => {
    expect(run(entry({ exclusiveMin: 0 }), '-').map((e) => e.name)).toEqual(['monto']);
    expect(run(entry({}), '1.')).toHaveLength(1);
  });

  it('a decimal with no bound accepts a negative', () => {
    expect(run(entry({}), '-3')).toEqual([]);
  });

  it('a field message literal words the bound failure', () => {
    expect(run(entry({ exclusiveMin: 0, message: 'Para {modo} un Monto , debes especificar su Monto.' }), '0')[0].message).toBe('Para agregar un Monto , debes especificar su Monto.');
  });
});

describe('G13 dec column renders as stored', () => {
  const columns = [{ key: 'monto' as const, format: 'dec' as const }, { key: 'nombre' as const }];
  const rows = [{ monto: 1.5, nombre: 'a' }, { monto: 0, nombre: 'b' }, { monto: 3.4567, nombre: 'c' }, { nombre: 'd' }];

  it('shows the stored number as text, never rounded; a missing value is empty', () => {
    expect(formatRows(columns, rows).map((r) => r.monto)).toEqual(['1.5', '0', '3.4567', '']);
  });
});
