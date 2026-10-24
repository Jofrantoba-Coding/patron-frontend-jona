import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useChildDraftsImpl } from './useChildDraftsImpl';

const run = () => {
  const hook = renderHook(() => useChildDraftsImpl(['activaciones']));
  act(() => hook.result.current.load({ activaciones: [{ id: '1', motivo: 'INICIO', estado: 'A' }, { id: '2', motivo: 'ANTES', estado: 'D' }] }));
  return hook;
};

describe('R-ACT-4 a deferred action changes a pending row (R-MD-4)', () => {
  it('a change on a persisted row shows over it and is sent as an A op with the changed fields and the state', () => {
    const { result } = run();
    act(() => result.current.change('activaciones', '1', { fecha_fin: '2026-04-01', motivo_fin: 'CIERRE' }, 'D'));
    expect(result.current.rows('activaciones').map((r) => [r._key, r.estado, r.fecha_fin])).toEqual([['1', 'D', '2026-04-01'], ['2', 'D', undefined]]);
    expect(result.current.dirty()).toBe(true);
    expect(result.current.payload()).toEqual({ children: { activaciones: [{ op: 'A', id: '1', fecha_fin: '2026-04-01', motivo_fin: 'CIERRE', estado: 'D' }] } });
  });

  it('a second change on the same row merges into its op and keeps the op in its place', () => {
    const { result } = run();
    act(() => result.current.add('activaciones', { motivo: 'NUEVA' }));
    act(() => result.current.change('activaciones', '1', { fecha_fin: '2026-04-01' }));
    act(() => result.current.change('activaciones', '1', { motivo_fin: 'CIERRE' }, 'D'));
    expect(result.current.payload()).toEqual({ children: { activaciones: [{ op: 'I', motivo: 'NUEVA' }, { op: 'A', id: '1', fecha_fin: '2026-04-01', motivo_fin: 'CIERRE', estado: 'D' }] } });
    expect(result.current.opKey('activaciones', 1)).toBe('1');
  });

  it('a change that gives no state keeps the row state and sends none', () => {
    const { result } = run();
    act(() => result.current.change('activaciones', '1', { motivo: 'OTRO' }));
    expect(result.current.rows('activaciones')[0]).toMatchObject({ estado: 'A', motivo: 'OTRO' });
    expect(result.current.payload()).toEqual({ children: { activaciones: [{ op: 'A', id: '1', motivo: 'OTRO' }] } });
  });

  it('a change on a pending row edits that row in place and sends it as the insert it still is', () => {
    const { result } = run();
    act(() => result.current.add('activaciones', { motivo: 'NUEVA' }));
    const key = result.current.rows('activaciones').at(-1)!._key;
    act(() => result.current.change('activaciones', key, { fecha_fin: '2026-05-01' }));
    expect(result.current.rows('activaciones').at(-1)).toMatchObject({ motivo: 'NUEVA', fecha_fin: '2026-05-01', estado: 'A' });
    expect(result.current.payload()).toEqual({ children: { activaciones: [{ op: 'I', motivo: 'NUEVA', fecha_fin: '2026-05-01' }] } });
  });

  it('quitar still deactivates with the state alone, after a change merges into the same op', () => {
    const { result } = run();
    act(() => result.current.quitar('activaciones', '1', 'deactivate'));
    expect(result.current.payload()).toEqual({ children: { activaciones: [{ op: 'A', id: '1', estado: 'D' }] } });
    act(() => result.current.change('activaciones', '1', { motivo_fin: 'X' }));
    expect(result.current.payload()).toEqual({ children: { activaciones: [{ op: 'A', id: '1', motivo_fin: 'X', estado: 'D' }] } });
  });

  it('loadOne replaces the persisted rows of one child and keeps the pending changes of the open register', () => {
    const { result } = run();
    act(() => result.current.add('activaciones', { motivo: 'NUEVA' }));
    act(() => result.current.loadOne('activaciones', [{ id: '1', motivo: 'DEL SERVIDOR', estado: 'D' }]));
    expect(result.current.rows('activaciones').map((r) => [r.motivo, r.estado])).toEqual([['DEL SERVIDOR', 'D'], ['NUEVA', 'A']]);
    expect(result.current.dirty()).toBe(true);
  });
});
