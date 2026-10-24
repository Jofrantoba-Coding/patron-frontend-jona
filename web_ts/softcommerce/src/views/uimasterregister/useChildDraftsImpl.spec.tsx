import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useChildDraftsImpl } from './useChildDraftsImpl';

const run = () => renderHook(() => useChildDraftsImpl(['direcciones', 'contactos']));

describe('useChildDraftsImpl (R-MD-4, S-MD-4)', () => {
  it('starts clean: no rows, not dirty, an empty payload', () => {
    const { result } = run();
    expect(result.current.rows('contactos')).toEqual([]);
    expect(result.current.dirty()).toBe(false);
    expect(result.current.payload()).toEqual({});
  });

  it('adds one pending row per add, marked active, and keeps each child apart', () => {
    const { result } = run();
    act(() => result.current.add('contactos', { nombre: 'ANA' }));
    expect(result.current.rows('contactos')).toMatchObject([{ nombre: 'ANA', estado: 'A' }]);
    expect(result.current.rows('direcciones')).toEqual([]);
    expect(result.current.dirty()).toBe(true);
  });

  it('sends the pending rows as insert ops, only for the children that changed', () => {
    const { result } = run();
    act(() => result.current.add('contactos', { nombre: 'ANA' }));
    act(() => result.current.add('contactos', { nombre: 'LUIS' }));
    expect(result.current.payload()).toEqual({ children: { contactos: [{ op: 'I', nombre: 'ANA' }, { op: 'I', nombre: 'LUIS' }] } });
  });

  it('shows persisted active and deactivated rows ahead of the pending ones and never a deleted one', () => {
    const { result } = run();
    act(() => result.current.load({ direcciones: [{ id: '1', calle: 'A', estado: 'A' }, { id: '2', calle: 'B', estado: 'D' }, { id: '3', calle: 'C', estado: 'A', activo: false }] }));
    act(() => result.current.add('direcciones', { calle: 'N' }));
    expect(result.current.rows('direcciones').map((r) => [r.calle, r.estado])).toEqual([['A', 'A'], ['B', 'D'], ['N', 'A']]);
    expect(result.current.dirty()).toBe(true);
  });

  it('offers only the active siblings (persisted and pending) to the uniqueness check (R-MD-6)', () => {
    const { result } = run();
    act(() => result.current.load({ direcciones: [{ id: '1', calle: 'A', estado: 'A' }, { id: '2', calle: 'B', estado: 'D' }] }));
    act(() => result.current.add('direcciones', { calle: 'N' }));
    expect(result.current.siblings('direcciones').map((r) => r.calle)).toEqual(['A', 'N']);
  });

  it('a loaded record alone is not a change', () => {
    const { result } = run();
    act(() => result.current.load({ direcciones: [{ id: '1', calle: 'A', estado: 'A' }] }));
    expect(result.current.dirty()).toBe(false);
    expect(result.current.payload()).toEqual({});
  });
});

describe('useChildDraftsImpl quitar (R-MD-4, S-MD-6)', () => {
  const persisted = { direcciones: [{ id: '1', calle: 'A', estado: 'A' }, { id: '2', calle: 'B', estado: 'D' }], contactos: [{ id_contacto: '7', nombre: 'ANA' }] };
  const loaded = () => {
    const hook = renderHook(() => useChildDraftsImpl(['direcciones', 'contactos'], { contactos: 'id_contacto' }));
    act(() => hook.result.current.load(persisted));
    return hook;
  };

  it('a pending row disappears and leaves no change behind', () => {
    const { result } = run();
    act(() => result.current.add('direcciones', { calle: 'N' }));
    act(() => result.current.quitar('direcciones', result.current.rows('direcciones')[0]._key, 'deactivate'));
    expect(result.current.rows('direcciones')).toEqual([]);
    expect(result.current.dirty()).toBe(false);
    expect(result.current.payload()).toEqual({});
  });

  it('a persisted row of kind deactivate turns deactivated, stays in the grid and is sent as an A op with estado D', () => {
    const { result } = loaded();
    act(() => result.current.quitar('direcciones', '1', 'deactivate'));
    expect(result.current.rows('direcciones').map((r) => [r._key, r.estado])).toEqual([['1', 'D'], ['2', 'D']]);
    expect(result.current.siblings('direcciones')).toEqual([]);
    expect(result.current.dirty()).toBe(true);
    expect(result.current.payload()).toEqual({ children: { direcciones: [{ op: 'A', id: '1', estado: 'D' }] } });
  });

  it('a persisted row of kind delete leaves the grid and is sent as an E op, keyed by the child idKey', () => {
    const { result } = loaded();
    act(() => result.current.quitar('contactos', '7', 'delete'));
    expect(result.current.rows('contactos')).toEqual([]);
    expect(result.current.payload()).toEqual({ children: { contactos: [{ op: 'E', id: '7' }] } });
  });

  it('keeps the changes of one child in the order they were made', () => {
    const { result } = loaded();
    act(() => result.current.add('direcciones', { calle: 'N' }));
    act(() => result.current.quitar('direcciones', '1', 'deactivate'));
    expect(result.current.payload()).toEqual({ children: { direcciones: [{ op: 'I', calle: 'N' }, { op: 'A', id: '1', estado: 'D' }] } });
  });
});
