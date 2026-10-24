import { describe, expect, it } from 'vitest';
import { todayIso } from '../../../mock-server/core/dates.js';
import { ACTION_RULES, type ActionCall } from './actionRules';

/**
 * The client rules of the padron Activar and Desactivar (R-ANX-7, S-ANX-9, S-ANX-11, S-ANX-12): pure over the rows of the grid. `check` refuses before the
 * confirmation (an empty text refuses silently), `guard` is the incompatibility check of `FormAnexoPadron.verificarPadron` inside the dialog, `apply` says what the
 * confirmed action does to the pending rows and to the master flags (`params.flags` maps a padron id to its flag).
 */
const FLAGS = { '02': 'flag_retencion', '03': 'flag_percepcion', '04': 'flag_buen_contrib' };
const row = (key: string, id_padron: string, estado: 'A' | 'D' = 'A') => ({ _key: key, id_padron, estado, f_inicio: '2026-03-10', f_fin: '' });
const call = (rows: ReturnType<typeof row>[], extra: Partial<ActionCall> = {}): ActionCall => ({ rows, input: {}, params: { flags: FLAGS }, ...extra });
const { activarPadron: activar, desactivarPadron: desactivar } = ACTION_RULES;

describe('S-ANX-9 Activar padron: the guard of verificarPadron', () => {
  it.each([
    ['the same padron is active', [row('1', '02')], '02', 'Padron ya se Encuentra Activado'],
    ['01 is added over an active 02', [row('1', '02')], '01', 'Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion'],
    ['01 is added over an active 03 (the case the desktop missed)', [row('1', '03')], '01', 'Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion'],
    ['02 is added over an active 01', [row('1', '01')], '02', 'Configuracion incompatible, Desactive Exceptuado'],
    ['03 is added over an active 01', [row('~1', '01')], '03', 'Configuracion incompatible, Desactive Exceptuado'],
  ])('refuses when %s', (_name, rows, id_padron, message) => {
    expect(activar.guard?.(call(rows, { input: { id_padron } }))).toBe(message);
  });

  it('accepts a padron nothing clashes with, and one whose row was deactivated', () => {
    expect(activar.guard?.(call([row('1', '02')], { input: { id_padron: '03' } }))).toBeUndefined();
    expect(activar.guard?.(call([row('1', '02', 'D')], { input: { id_padron: '02' } }))).toBeUndefined();
    expect(activar.guard?.(call([], { input: { id_padron: '04' } }))).toBeUndefined();
  });

  it('a blank padron says Seleccione Padron', () => {
    expect(activar.guard?.(call([], { input: { id_padron: '' } }))).toBe('Seleccione Padron');
  });

  it('S-ANX-12 adds one pending row and checks the flag of the padron id (04 is Buen Contribuyente, not Percepcion)', () => {
    const input = { id_padron: '04', f_inicio: '2026-03-12' };
    expect(activar.apply(call([], { input }))).toEqual({ insert: input, parent: { flag_buen_contrib: 'true' } });
    expect(activar.apply(call([], { input: { id_padron: '03', f_inicio: '2026-03-12' } })).parent).toEqual({ flag_percepcion: 'true' });
  });
});

describe('S-ANX-11 Desactivar padron', () => {
  const rows = [row('1', '02'), row('2', '03', 'D')];

  it('does nothing without rows and says Seleccionar Fila without a selection', () => {
    expect(desactivar.check?.(call([]))).toBe('');
    expect(desactivar.check?.(call(rows))).toBe('Seleccionar Fila');
  });

  it('refuses a deactivated row and goes on with an active one', () => {
    expect(desactivar.check?.(call(rows, { selected: rows[1] }))).toBe('Padron Seleccionado ya esta desactivado');
    expect(desactivar.check?.(call(rows, { selected: rows[0] }))).toBeUndefined();
  });

  it('closes a persisted row with fecha fin today and unchecks the flag of its padron id', () => {
    expect(desactivar.apply(call(rows, { selected: rows[0] }))).toEqual({ change: { patch: { f_fin: todayIso() }, estado: 'D' }, parent: { flag_retencion: 'false' } });
  });

  it('a pending row (never saved) leaves the grid and unchecks the flag', () => {
    const pending = row('~1', '04');
    expect(desactivar.apply(call([pending], { selected: pending }))).toEqual({ remove: true, parent: { flag_buen_contrib: 'false' } });
  });
});
