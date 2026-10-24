import { describe, expect, it } from 'vitest';
import { findConflict, isActive, isActiveSibling, same } from './unique.js';

const rows = [
  { id: '1', almacen: 'A', proceso: 'VENTA', estado: 'A' },
  { id: '2', almacen: 'B', proceso: 'VENTA', estado: 'D' },
  { id: '3', almacen: 'C', proceso: 'VENTA', estado: 'A', activo: false },
];
const fields = ['almacen', 'proceso'];

describe('core/unique.js (R-MD-6, shared by the server and the client)', () => {
  it('same compares trimmed text and reads null and undefined as empty', () => {
    expect([same(' A ', 'A'), same(null, ''), same(undefined, ''), same('A', 'B')]).toEqual([true, true, true, false]);
  });

  it('isActive is the logical delete flag; isActiveSibling also drops estado D', () => {
    expect(rows.map(isActive)).toEqual([true, true, false]);
    expect(rows.map(isActiveSibling)).toEqual([true, false, false]);
  });

  it('finds an active sibling holding the same values', () => {
    expect(findConflict(rows, fields, { almacen: 'A', proceso: 'VENTA' }, { active: isActiveSibling })).toBe(rows[0]);
  });

  it('ignores deactivated and deleted siblings', () => {
    expect(findConflict(rows, fields, { almacen: 'B', proceso: 'VENTA' }, { active: isActiveSibling })).toBeUndefined();
    expect(findConflict(rows, fields, { almacen: 'C', proceso: 'VENTA' }, { active: isActiveSibling })).toBeUndefined();
  });

  it('counts a deactivated row when only the logical delete flag is the activity rule', () => {
    expect(findConflict(rows, fields, { almacen: 'B', proceso: 'VENTA' })).toBe(rows[1]);
  });

  it('never conflicts with the record itself', () => {
    expect(findConflict(rows, fields, { almacen: 'A', proceso: 'VENTA' }, { selfId: '1', active: isActiveSibling })).toBeUndefined();
  });

  it('needs every field to match', () => {
    expect(findConflict(rows, fields, { almacen: 'A', proceso: 'COMPRA' }, { active: isActiveSibling })).toBeUndefined();
  });

  it('compares on the idKey given', () => {
    const own = [{ codigo: 'x', a: '1' }];
    expect(findConflict(own, ['a'], { a: '1' }, { selfId: 'x', idKey: 'codigo' })).toBeUndefined();
    expect(findConflict(own, ['a'], { a: '1' }, { selfId: 'y', idKey: 'codigo' })).toBe(own[0]);
  });
});
