import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, updateRecord } from './catalog.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';

/** Test-only entry: a scalar default, a per-mode default and a plain boolean. */
const entry = {
  slug: 'things', idKey: 'id_things', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 },
    { name: 'activa', kind: 'boolean', label: 'Activa', default: true },
    { name: 'estado', kind: 'boolean', label: 'Activo', default: { INSERT: true, UPDATE: false } },
    { name: 'plana', kind: 'boolean', label: 'Plana' },
  ],
  columns: [{ key: 'descripcion', header: 'D' }],
};
const store = () => createStore({ ...tinySeed(), things: { a: [] } }, validateRegistry([entry]));

describe('declared defaults on create (R-CRUD-15, R-REF-3)', () => {
  it('stores the scalar default and the INSERT entry of a per-mode default when the body omits them', () => {
    expect(createRecord(store(), 'a', 'things', { descripcion: 'X' })).toMatchObject({ activa: true, estado: true });
  });

  it('keeps what the body sends, and a boolean with no declared default stays unset', () => {
    const created = createRecord(store(), 'a', 'things', { descripcion: 'X', activa: false, estado: false });
    expect(created).toMatchObject({ activa: false, estado: false });
    expect(created).not.toHaveProperty('plana');
  });

  it('an update never re-applies a default', () => {
    const s = store();
    const { id_things: id } = createRecord(s, 'a', 'things', { descripcion: 'X', activa: false });
    expect(updateRecord(s, 'a', 'things', id, { descripcion: 'Y' })).toMatchObject({ activa: false, estado: true });
  });
});
