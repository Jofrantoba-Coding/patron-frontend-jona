import { describe, expect, it } from 'vitest';
import { ACTION_RULES, type ActionCall } from './actionRules';

/**
 * The client rules of the anexo Activar and Desactivar (R-ANX-3, R-ANX-4, S-ANX-2..6): pure over the rows of the grid. `check` refuses BEFORE the dialog opens
 * (an empty text refuses silently), `guard` refuses inside it, `apply` says what the confirmed dialog does to the pending rows and to the master `estado`.
 */
const row = (key: string, estado: 'A' | 'D', extra: Record<string, unknown> = {}) => ({ _key: key, estado, f_inicio: '2026-03-10', ...extra });
const call = (rows: ReturnType<typeof row>[], extra: Partial<ActionCall> = {}): ActionCall => ({ rows, input: {}, params: { entity: 'Trabajador' }, ...extra });
const { activarAnexo: activar, desactivarAnexo: desactivar } = ACTION_RULES;

describe('R-ANX-3 Activar', () => {
  it.each([
    ['the last row is active', [row('1', 'D'), row('2', 'A')], 'Trabajador ya Esta Activado'],
    ['a row was just added (pending, active)', [row('1', 'D'), row('~1', 'A')], 'Trabajador ya Esta Activado'],
    ['the last row was just deactivated in this register', [row('1', 'D', { _changed: true })], 'Trabajador recien lo acaba de Desactivar'],
  ])('is refused before the dialog when %s', (_name, rows, message) => {
    expect(activar.check?.(call(rows))).toBe(message);
  });

  it('goes on when the last row was deactivated before this register, and on an empty history', () => {
    expect(activar.check?.(call([row('1', 'A'), row('2', 'D')]))).toBeUndefined();
    expect(activar.check?.(call([]))).toBeUndefined();
  });

  it('adds one pending row with the dialog values and checks the master estado', () => {
    const input = { f_inicio: '2026-03-12', motivo_activacion: 'REINGRESO' };
    expect(activar.apply(call([row('1', 'D')], { input }))).toEqual({ insert: input, parent: { estado: 'true' } });
  });
});

describe('R-ANX-4 Desactivar', () => {
  const rows = [row('1', 'A')];

  it('does nothing without rows, asks for a selection otherwise', () => {
    expect(desactivar.check?.(call([]))).toBe('');
    expect(desactivar.check?.(call(rows))).toBe('Seleccione un Registro');
  });

  it.each([
    ['is already deactivated', row('1', 'D'), 'Registro ya esta Desactivado'],
    ['was just activated in this register', row('~1', 'A'), 'Trabajador recien lo acaba de Activar'],
  ])('refuses a selected row that %s', (_name, selected, message) => {
    expect(desactivar.check?.(call([selected], { selected }))).toBe(message);
  });

  it('goes on with an active persisted row', () => {
    expect(desactivar.check?.(call(rows, { selected: rows[0] }))).toBeUndefined();
  });

  it('S-ANX-6 the guard refuses a fecha fin before the start and accepts the same day', () => {
    expect(desactivar.guard?.(call(rows, { selected: rows[0], input: { f_fin: '2026-03-09' } }))).toBe('Fecha es menor a fecha inicial');
    expect(desactivar.guard?.(call(rows, { selected: rows[0], input: { f_fin: '2026-03-10' } }))).toBeUndefined();
  });

  it('closes the selected row with the dialog values and unchecks the master estado', () => {
    const input = { f_fin: '2026-03-12', motivo_desactivacion: 'CIERRE' };
    expect(desactivar.apply(call(rows, { selected: rows[0], input }))).toEqual({ change: { patch: input, estado: 'D' }, parent: { estado: 'false' } });
  });
});
