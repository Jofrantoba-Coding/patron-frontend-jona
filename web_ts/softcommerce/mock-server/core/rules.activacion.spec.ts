import { describe, expect, it } from 'vitest';
import { activacion, applyOps, checkOps, FECHA_MENOR, lastIsActive, MOTIVO_REQUERIDO } from './activacionRule.js';

/**
 * The pure `activacion` rule (R-ANX-3..5, D13): at most one active row per master, the master estado is the state of the LAST row, a deactivation cannot end
 * before it started, and a legacy master (no rows, or rows with no estado) counts as active. Rows: `{ id, estado, f_inicio, f_fin, motivo_* }`.
 */
const TODAY = '2026-03-12';
const active = (id: string, f_inicio = '2026-03-10', extra: Record<string, unknown> = {}) => ({ id, estado: 'A', f_inicio, f_fin: '', motivo_activacion: 'INICIO', ...extra });
const closed = (id: string, f_inicio = '2026-01-01', f_fin = '2026-02-01') => ({ id, estado: 'D', f_inicio, f_fin, motivo_activacion: 'INICIO', motivo_desactivacion: 'CIERRE' });
const insert = (extra: Record<string, unknown> = {}) => ({ op: 'I', f_inicio: '2026-03-11', motivo_activacion: 'REINGRESO', ...extra });
const deactivate = (id: string, extra: Record<string, unknown> = {}) => ({ op: 'A', id, estado: 'D', f_fin: '2026-03-11', motivo_desactivacion: 'CIERRE', ...extra });
const check = (stored: any[], ops: any[]) => checkOps(stored, ops, { entity: 'Banco', child: 'activaciones', today: TODAY });

describe('R-ANX-5 one active row (S-ANX-7)', () => {
  it.each([
    ['a second active row over an active one', [active('1')], [insert()]],
    ['two inserts into an empty history', [], [insert(), insert({ motivo_activacion: 'OTRO' })]],
    ['an insert over a legacy row that has no estado', [{ id: '1', f_inicio: '2026-01-01' }], [insert()]],
    ['two inserts after the last row was deactivated', [closed('1')], [insert(), insert({ motivo_activacion: 'OTRO' })]],
  ])('refuses %s with the entity sentence', (_name, stored, ops) => {
    expect(check(stored, ops)).toEqual({ conflict: 'Banco ya Esta Activado' });
  });

  it.each([
    ['an insert after the last row was deactivated', [closed('1')], [insert()]],
    ['a deactivation and an insert in the same body', [active('1')], [deactivate('1'), insert()]],
    ['an insert into an empty history', [], [insert()]],
    ['nothing to do', [active('1')], []],
  ])('accepts %s', (_name, stored, ops) => {
    expect(check(stored, ops)).toBeNull();
  });

  it('an op that deletes the active row leaves room for a new one', () => {
    expect(check([active('1')], [{ op: 'E', id: '1' }, insert()])).toBeNull();
  });
});

describe('R-ANX-4 / S-ANX-6 the fecha fin rule', () => {
  it('refuses a fecha fin before the start, on the indexed field of the op', () => {
    expect(check([active('1', '2026-03-10')], [deactivate('1', { f_fin: '2026-03-09' })])).toEqual({
      invalid: { field: 'activaciones[0].f_fin', code: 'RANGE', message: FECHA_MENOR },
    });
    expect(FECHA_MENOR).toBe('Fecha es menor a fecha inicial');
  });

  it('accepts the same day and any later one', () => {
    expect(check([active('1', '2026-03-10')], [deactivate('1', { f_fin: '2026-03-10' })])).toBeNull();
    expect(check([active('1', '2026-03-10')], [deactivate('1', { f_fin: '2026-04-01' })])).toBeNull();
  });

  it('judges the start of a row inserted in the same body', () => {
    expect(check([], [insert({ f_inicio: '2026-03-11' }), deactivate('~0', { f_fin: '2026-03-10' })])).toMatchObject({ invalid: { field: 'activaciones[1].f_fin' } });
    expect(check([], [insert({ f_inicio: '2026-03-11' }), deactivate('~0', { f_fin: '2026-03-11' })])).toBeNull();
  });

  it('refuses a deactivation without a motivo', () => {
    expect(check([active('1')], [deactivate('1', { motivo_desactivacion: ' ' })])).toEqual({
      invalid: { field: 'activaciones[0].motivo_desactivacion', code: 'REQUIRED', message: MOTIVO_REQUERIDO },
    });
    expect(MOTIVO_REQUERIDO).toBe('Ingrese Motivo');
  });
});

describe('R-ANX-5 the master estado follows the last row', () => {
  it.each([
    ['no rows (a legacy master)', [], true],
    ['a legacy row with no estado', [{ id: '1' }], true],
    ['an active last row', [closed('1'), active('2')], true],
    ['a deactivated last row', [active('1'), closed('2')], false],
  ])('%s', (_name, rows, expected) => {
    expect(lastIsActive(rows)).toBe(expected);
  });

  it('applyOps replays the ops over the stored rows in order: inserts at the end, deactivations in place, deletions gone', () => {
    const rows = applyOps([active('1'), closed('2')], [deactivate('1'), insert(), { op: 'E', id: '2' }], TODAY);
    expect(rows.map((r) => [r.id, r.estado])).toEqual([['1', 'D'], ['~1', 'A']]);
    expect(rows[1]).toMatchObject({ f_inicio: '2026-03-11', motivo_activacion: 'REINGRESO' });
  });

  it('an insert without a start takes today', () => {
    expect(applyOps([], [{ op: 'I', motivo_activacion: 'X' }], TODAY)[0].f_inicio).toBe(TODAY);
  });
});

describe('the entry rule claims estado', () => {
  it('owns the estado column of the master (R-ACT-5)', () => {
    expect(activacion.owns()).toEqual(['estado']);
  });
});
