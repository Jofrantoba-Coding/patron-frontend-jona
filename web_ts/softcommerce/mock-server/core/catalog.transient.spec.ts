import { describe, expect, it } from 'vitest';
import { createRecord, getRecord, updateRecord } from './catalog.js';
import { validateRegistry } from '../registry/schema.js';
import { createStore } from './store.js';
import { readSeed } from './test-helpers.js';

/** A transient select is a form-only level (the ubigeo cascade of ZonaDistancia): never stored, never validated, never a parent the server checks. */
const registry = validateRegistry([
  {
    slug: 'zonas', idKey: 'id_zona', codeWidth: 0, entity: 'una Zona', scope: 'tenant', seed: 'zonas', messages: { style: 'M1' },
    fields: [{ name: 'id_zona', kind: 'code', label: 'Código' }, { name: 'descripcion', kind: 'text', label: 'Descripción', max: 10 }, { name: 'id_ubigeo', kind: 'text', label: 'Ubigeo', max: 6 }],
    columns: [{ key: 'descripcion', header: 'D' }],
  },
  {
    slug: 'rutas', idKey: 'id_ruta', codeWidth: 0, entity: 'una Ruta', scope: 'tenant', seed: 'rutas', messages: { style: 'MS' },
    fields: [
      { name: 'id_ruta', kind: 'code', label: 'Código' },
      { name: 'id_distrito', kind: 'select', label: 'Distrito', required: true, source: { catalog: 'ubigeo' }, transient: true, restoreFrom: { field: 'id_ubigeo', prefixLen: 6 } },
      { name: 'id_zona', kind: 'select', label: 'Zona', required: true, article: 'una', source: { catalog: 'zonas' }, dependsOn: [{ field: 'id_distrito', filterKey: 'id_ubigeo' }] },
    ],
    columns: [{ key: 'id_zona', header: 'Z' }],
    joins: [{ as: 'id_ubigeo', ref: 'id_zona', display: 'id_ubigeo' }],
  },
]);
const store = () =>
  createStore(
    { ...readSeed(), zonas: { demo: [{ id_zona: '1', descripcion: 'NORTE', id_ubigeo: '150101', activo: true }, { id_zona: '2', descripcion: 'SUR', id_ubigeo: '080101', activo: true }] }, rutas: { demo: [] } },
    registry,
  );

describe('a transient select stays out of the server', () => {
  it('is not stored, even when the body carries it', () => {
    const created = createRecord(store(), 'demo', 'rutas', { id_distrito: '150101', id_zona: '1' });
    expect(created).toMatchObject({ id_zona: '1' });
    expect(created).not.toHaveProperty('id_distrito');
  });

  it('is not validated: a body without it still creates, and the zona is the only thing asked for', () => {
    expect(createRecord(store(), 'demo', 'rutas', { id_zona: '1' })).toMatchObject({ id_zona: '1' });
    expect(() => createRecord(store(), 'demo', 'rutas', { id_distrito: '150101' })).toThrowError(expect.objectContaining({ status: 422, details: [expect.objectContaining({ field: 'id_zona', message: 'Para agregar una Ruta, debes Seleccionar una Zona.' })] }));
  });

  it('is no parent the server checks: a zona of another distrito is accepted (the distrito is not stored)', () => {
    expect(createRecord(store(), 'demo', 'rutas', { id_distrito: '150101', id_zona: '2' })).toMatchObject({ id_zona: '2' });
  });

  it('a join over the zona hands the record the distrito code the form restores its levels from (GET, and after UPDATE)', () => {
    const s = store();
    const created = createRecord(s, 'demo', 'rutas', { id_zona: '1' });
    expect(getRecord(s, 'demo', 'rutas', String(created.id_ruta)).id_ubigeo).toBe('150101');
    expect(updateRecord(s, 'demo', 'rutas', String(created.id_ruta), { id_zona: '2' }).id_ubigeo).toBe('080101');
  });
});
