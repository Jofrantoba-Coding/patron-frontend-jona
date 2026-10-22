import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';

/** Test-only entry: two padded integers with a value range, checked required-first then range (R-REF-7 Turno order). */
const integer = (name: string, range: { min?: number; max?: number }, over: Record<string, any> = {}) => ({
  name, kind: 'number', label: name, scale: 0, required: true, max: 2, normalize: ['digits', 'padLeft:2'], range,
  messages: { range: `Para {modo}, debes Insertar ${name} Correcto.` }, ...over,
});
const ENTRY = {
  slug: 'relojes', idKey: 'id_reloj', codeWidth: 0, entity: 'un Reloj', scope: 'tenant', seed: 'relojes', messages: { style: 'M2' },
  fields: [integer('hora', { min: 0, max: 12 }), integer('minuto', { min: 0, max: 59 }), integer('dias', { min: 0 }, { normalize: ['digits'], required: false })],
  columns: [{ key: 'hora', header: 'H' }],
  validation: ['hora', 'minuto', { range: 'hora' }, { range: 'minuto' }, 'dias'],
};
const PLAIN = { ...ENTRY, slug: 'planos', idKey: 'id_plano', seed: 'planos', validation: undefined };

const store = () =>
  createStore({ ...tinySeed(), relojes: { a: [{ id_reloj: '1', hora: '05', minuto: '30', activo: true }] }, planos: { a: [] } }, validateRegistry([ENTRY, PLAIN]));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const create = (slug: string, body: Record<string, any>) => createRecord(store(), 'a', slug, body);

describe('S-MOCK-19 integer ranges (R-MOCK-10)', () => {
  it.each([
    ['hora above its range', { hora: '13', minuto: '30' }, 'hora', 'Para agregar, debes Insertar hora Correcto.'],
    ['minuto above its range', { hora: '12', minuto: '60' }, 'minuto', 'Para agregar, debes Insertar minuto Correcto.'],
    ['hora far above, padded first', { hora: '99', minuto: '30' }, 'hora', 'Para agregar, debes Insertar hora Correcto.'],
  ])('%s is a 422 on the field with its literal message', (_name, body, field, message) => {
    const error = caught(() => create('relojes', body));
    expect([error.status, error.code, error.details.map((d) => [d.field, d.message])]).toEqual([422, 'VALIDATION_ERROR', [[field, message]]]);
  });

  it.each([
    ['both zero', { hora: '0', minuto: '0' }, { hora: '00', minuto: '00' }],
    ['the upper bounds', { hora: '12', minuto: '59' }, { hora: '12', minuto: '59' }],
    ['a single digit is padded by the server', { hora: '5', minuto: '7' }, { hora: '05', minuto: '07' }],
  ])('%s is accepted', (_name, body, stored) => {
    expect(create('relojes', body)).toMatchObject(stored);
  });

  it('a range with only min accepts any larger value and rejects nothing above', () => {
    expect(create('relojes', { hora: '1', minuto: '1', dias: '99' })).toMatchObject({ dias: '99' });
  });

  it('a non-digit value is a 422 on the field, not a range error', () => {
    const error = caught(() => create('relojes', { hora: 'ab', minuto: '30' }));
    expect(error.details.map((d) => d.field)).toEqual(['hora']);
  });

  it('digits past max are a 422 on the field', () => {
    const error = caught(() => create('relojes', { hora: '123', minuto: '30' }));
    expect(error.details.map((d) => d.field)).toEqual(['hora']);
  });

  it('range steps run after the required steps: a blank minuto beats a bad hora (R-REF-7 order)', () => {
    const error = caught(() => create('relojes', { hora: '13', minuto: '' }));
    expect(error.details.map((d) => [d.field, d.message])).toEqual([['minuto', 'Para agregar, debes especificar su minuto.']]);
  });

  it('without a declared range step the range is checked with its own field, in field order', () => {
    const error = caught(() => create('planos', { hora: '13', minuto: '' }));
    expect(error.details.map((d) => d.field)).toEqual(['hora']);
  });

  it('UPDATE words the range message with modificar', () => {
    const s = store();
    const error = caught(() => updateRecord(s, 'a', 'relojes', '1', { hora: '13', minuto: '30' }));
    expect(error.details[0].message).toBe('Para modificar, debes Insertar hora Correcto.');
  });
});
