import { describe, expect, it } from 'vitest';
import { ACTION_RULES, type ActionCall } from './actionRules';

/**
 * The client rules of the Cliente sustitutos Activar and Desactivar (R-MST-12, S-MST-24; `RegisterClienteNuevo.activarSustituto` / `desactivarSustituto`): pure over the rows of the grid.
 * `check` refuses before the confirmation (an empty text refuses silently), `apply` says what the confirmed action does to the selected row.
 */
const row = (key: string, estado: 'A' | 'D' = 'A', estado_cliente: unknown = 'true') => ({ _key: key, id_hijo: '0000000002', estado, estado_cliente });
const call = (rows: ReturnType<typeof row>[], selected?: ReturnType<typeof row>): ActionCall => ({ rows, selected, input: {}, params: {} });
const { activarSustituto: activar, desactivarSustituto: desactivar } = ACTION_RULES;

describe('S-MST-24 Activar sustituto', () => {
  it('an empty grid refuses silently and no selection says Seleccionar un Elemento.', () => {
    expect(activar.check?.(call([]))).toBe('');
    expect(activar.check?.(call([row('1')]))).toBe('Seleccionar un Elemento.');
  });

  it('an active row says Sustituto ya esta activado, before the state of its cliente is read', () => {
    const active = row('1', 'A', 'false');
    expect(activar.check?.(call([active], active))).toBe('Sustituto ya esta activado');
  });

  it.each([['false'], [false], ['D']])('a deactivated row whose cliente is deactivated (%s) says Cliente esta desactivado', (estado_cliente) => {
    const closed = row('1', 'D', estado_cliente);
    expect(activar.check?.(call([closed], closed))).toBe('Cliente esta desactivado');
  });

  it('a deactivated row of an active cliente may go on, and the confirmed action activates it', () => {
    const closed = row('1', 'D');
    expect(activar.check?.(call([closed], closed))).toBeUndefined();
    expect(activar.apply(call([closed], closed))).toEqual({ change: { estado: 'A' } });
  });
});

describe('S-MST-24 Desactivar sustituto', () => {
  it('an empty grid refuses silently, no selection says Seleccionar un Elemento., a deactivated row says Sustituto ya esta desactivado', () => {
    expect(desactivar.check?.(call([]))).toBe('');
    expect(desactivar.check?.(call([row('1')]))).toBe('Seleccionar un Elemento.');
    const closed = row('1', 'D');
    expect(desactivar.check?.(call([closed], closed))).toBe('Sustituto ya esta desactivado');
  });

  it('a persisted row is deactivated, a pending one (key ~) is removed: nobody saved it, so there is nothing to close', () => {
    const saved = row('1');
    const pending = row('~1');
    expect(desactivar.check?.(call([saved], saved))).toBeUndefined();
    expect(desactivar.apply(call([saved], saved))).toEqual({ change: { estado: 'D' } });
    expect(desactivar.apply(call([pending], pending))).toEqual({ remove: true });
  });
});
