import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';

/** Test-only entry (S-CRUD-28): no Wave 2 catalog enables `notFuture`, `min` or `afterField`. */
const date = (name: string, over: Record<string, any> = {}) => ({ name, kind: 'date', label: name, required: true, ...over });
const ENTRY = {
  slug: 'agenda', idKey: 'id_agenda', codeWidth: 0, entity: 'una Cita', scope: 'tenant', seed: 'agenda', messages: { style: 'M1' },
  fields: [
    date('fecha', { messages: { date: 'La fecha de la Cita no es válida.' }, message: 'La fecha de la Cita no es válida.' }),
    date('limite', { required: false, notFuture: true, messages: { notFuture: 'La fecha límite de {modo} no puede ser futura.' } }),
    date('desde', { required: false, min: '2026-01-01', messages: { min: 'Desde no puede ser anterior al 01/01/2026.' } }),
    date('fecha_ini', { required: false }),
    date('fecha_fin', { required: false, afterField: 'fecha_ini', messages: { afterField: 'Fecha Fin no puede ser menor que Fecha Ini.' } }),
    date('hoy', { required: false, default: 'today' }),
  ],
  columns: [{ key: 'fecha', header: 'F', type: 'date' }],
};
const store = () => createStore({ ...tinySeed(), agenda: { a: [{ id_agenda: '1', fecha: '2026-01-15', activo: true }] } }, validateRegistry([ENTRY]));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const create = (body: Record<string, any>) => createRecord(store(), 'a', 'agenda', body);
const bad = (body: Record<string, any>) => caught(() => create(body)).details.map((d) => [d.field, d.code, d.message]);

describe('S-MOCK-19 / S-CRUD-27 date fields on the server', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 5, 15, 12, 0));
  });
  afterEach(() => vi.useRealTimers());

  it('accepts an ISO date and stores it as sent', () => {
    expect(create({ fecha: '2026-01-15' })).toMatchObject({ fecha: '2026-01-15' });
  });

  it.each([['an impossible day', '2026-02-31'], ['a month 13', '2026-13-01'], ['the display format', '15/01/2026'], ['text', 'ayer'], ['a date-time', '2026-01-15T10:00']])('rejects %s with the date literal', (_name, fecha) => {
    expect(bad({ fecha })).toEqual([['fecha', 'DATE', 'La fecha de la Cita no es válida.']]);
  });

  it('a blank required date is the required literal of the field', () => {
    expect(bad({ fecha: ' ' })).toEqual([['fecha', 'REQUIRED', 'La fecha de la Cita no es válida.']]);
  });

  it('an omitted optional date stays empty, and today fills a date whose default is today', () => {
    expect(create({ fecha: '2026-01-15' })).toMatchObject({ hoy: '2026-06-15' });
    expect(create({ fecha: '2026-01-15' }).limite).toBeUndefined();
  });

  it('notFuture: today is accepted, tomorrow is a 422 with the configured message and {modo}', () => {
    expect(create({ fecha: '2026-01-15', limite: '2026-06-15' })).toMatchObject({ limite: '2026-06-15' });
    expect(bad({ fecha: '2026-01-15', limite: '2026-06-16' })).toEqual([['limite', 'NOT_FUTURE', 'La fecha límite de agregar no puede ser futura.']]);
  });

  it('min: the bound is inclusive, one day before is a 422', () => {
    expect(create({ fecha: '2026-01-15', desde: '2026-01-01' })).toMatchObject({ desde: '2026-01-01' });
    expect(bad({ fecha: '2026-01-15', desde: '2025-12-31' })).toEqual([['desde', 'MIN_DATE', 'Desde no puede ser anterior al 01/01/2026.']]);
  });

  it('afterField: an earlier end is a 422 on the end date, equal dates are accepted', () => {
    expect(bad({ fecha: '2026-01-15', fecha_ini: '2026-02-01', fecha_fin: '2026-01-01' })).toEqual([['fecha_fin', 'AFTER_FIELD', 'Fecha Fin no puede ser menor que Fecha Ini.']]);
    expect(create({ fecha: '2026-01-15', fecha_ini: '2026-02-01', fecha_fin: '2026-02-01' })).toMatchObject({ fecha_fin: '2026-02-01' });
    expect(create({ fecha: '2026-01-15', fecha_ini: '2026-02-01', fecha_fin: '2026-03-01' })).toMatchObject({ fecha_fin: '2026-03-01' });
  });

  it('UPDATE checks the merged record: moving fecha_ini past the stored fecha_fin fails on fecha_fin', () => {
    const s = store();
    const made = createRecord(s, 'a', 'agenda', { fecha: '2026-01-15', fecha_ini: '2026-02-01', fecha_fin: '2026-03-01' });
    const error = caught(() => updateRecord(s, 'a', 'agenda', made.id_agenda, { fecha_ini: '2026-04-01' }));
    expect(error.details.map((d) => d.field)).toEqual(['fecha_fin']);
  });
});
