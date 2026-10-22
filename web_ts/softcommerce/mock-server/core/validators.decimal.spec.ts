import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';

/** Test-only entry: three decimals (positive, non-negative, unbounded) checked by the declared field order (R-MOCK-10). */
const decimal = (name: string, over: Record<string, any> = {}) => ({ name, kind: 'number', label: name, scale: 2, required: true, ...over });
const ENTRY = {
  slug: 'cambios', idKey: 'id_cambio', codeWidth: 0, entity: 'un Cambio', scope: 'tenant', seed: 'cambios', messages: { style: 'M1' },
  fields: [
    decimal('compra', { exclusiveMin: 0, message: 'Para {modo} un Cambio , debes especificar su Compra.' }),
    decimal('venta', { exclusiveMin: 0 }),
    decimal('piso', { min: 0, required: false }),
    decimal('libre', { required: false }),
  ],
  columns: [{ key: 'compra', header: 'C' }],
};
const store = () => createStore({ ...tinySeed(), cambios: { a: [{ id_cambio: '1', compra: 3.5, venta: 3.6, activo: true }] } }, validateRegistry([ENTRY]));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const create = (body: Record<string, any>) => createRecord(store(), 'a', 'cambios', body);
const bad = (body: Record<string, any>) => caught(() => create(body)).details.map((d) => [d.field, d.code, d.message]);

describe('S-MOCK-19 decimal numbers (R-MOCK-10)', () => {
  it.each([
    ['a number', { compra: 3.456, venta: 3.5 }, { compra: 3.456, venta: 3.5 }],
    ['strings, kept as sent', { compra: '3.4567', venta: '0.0001' }, { compra: '3.4567', venta: '0.0001' }],
    ['a negative where there is no bound', { compra: 1, venta: 1, libre: -3 }, { libre: -3 }],
    ['zero where the bound is inclusive', { compra: 1, venta: 1, piso: 0 }, { piso: 0 }],
  ])('accepts %s', (_name, body, stored) => {
    expect(create(body)).toMatchObject(stored);
  });

  it.each([
    ['zero', { compra: 0, venta: 1 }],
    ['a negative', { compra: -1, venta: 1 }],
    ['the string 0.0', { compra: '0.0', venta: 1 }],
  ])('rejects %s under exclusiveMin 0 with the literal of the field', (_name, body) => {
    expect(bad(body)).toEqual([['compra', 'RANGE', 'Para agregar un Cambio , debes especificar su Compra.']]);
  });

  it('wording of a bound failure without a literal is the entry style', () => {
    expect(bad({ compra: 1, venta: 0 })).toEqual([['venta', 'RANGE', 'Para agregar un Cambio, debes especificar su venta.']]);
  });

  it('min is inclusive: just below it is a 422', () => {
    expect(bad({ compra: 1, venta: 1, piso: -0.01 }).map((d) => d[0])).toEqual(['piso']);
  });

  it.each(['abc', '1.', '-', '1.5.2', '1e3'])('rejects the text %s as invalid, not as a bound error', (text) => {
    expect(bad({ compra: text, venta: 1 })).toEqual([['compra', 'INVALID', 'compra must be a number']]);
  });

  it('a blank decimal is the required text', () => {
    expect(bad({ compra: '', venta: 1 }).map((d) => d.slice(0, 2))).toEqual([['compra', 'REQUIRED']]);
  });

  it('stops at the first failing field, like the desktop', () => {
    expect(bad({ compra: 0, venta: 0 }).map((d) => d[0])).toEqual(['compra']);
  });

  it('UPDATE words the bound failure with modificar', () => {
    const s = store();
    const error = caught(() => updateRecord(s, 'a', 'cambios', '1', { compra: 0 }));
    expect(error.details[0].message).toBe('Para modificar un Cambio , debes especificar su Compra.');
  });
});
