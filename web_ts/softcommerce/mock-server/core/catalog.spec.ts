import { describe, expect, it } from 'vitest';
import {
  createRecord,
  deleteRecord,
  getRecord,
  listCatalog,
  updateRecord,
} from './catalog.js';
import { MockError } from './errors.js';
import { createStore } from './store.js';
import { readSeed } from './test-helpers.js';

const validBody = {
  id_empresa: '1',
  descripcion: 'LOCAL NUEVO',
  direccion: 'AV. SIEMPRE VIVA 742',
  id_ubigeo: '150101',
};

function realStore() {
  return createStore(readSeed());
}

/** Store whose demo tenant holds exactly `count` active localidades. */
function storeWithRows(count: number) {
  const seed = readSeed();
  seed.localidades.demo = Array.from({ length: count }, (_, i) => ({
    id_localidad: String(i + 1),
    id_empresa: '1',
    descripcion: `LOCAL ${i + 1}`,
    direccion: 'X',
    id_ubigeo: '150101',
    activo: true,
  }));
  return createStore(seed);
}

function catchError(fn: () => unknown): MockError {
  try {
    fn();
  } catch (e) {
    return e as MockError;
  }
  throw new Error('expected function to throw');
}

describe('listCatalog', () => {
  it('S-MOCK-7 returns the envelope for page 2 of 25 with pageSize 10', () => {
    const res = listCatalog(storeWithRows(25), 'demo', 'localidades', { page: '2', pageSize: '10' });
    expect(res.items).toHaveLength(10);
    expect(res.items.map((r: any) => r.id_localidad)).toEqual(
      ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    );
    expect(res.pagination).toEqual({ page: 2, pageSize: 10, total: 25 });
  });

  it('returns the remainder on the last page', () => {
    const res = listCatalog(storeWithRows(25), 'demo', 'localidades', { page: '3', pageSize: '10' });
    expect(res.items).toHaveLength(5);
    expect(res.pagination.total).toBe(25);
  });

  it('defaults pageSize to 20 and clamps it to 1000', () => {
    const store = storeWithRows(25);
    const def = listCatalog(store, 'demo', 'localidades');
    expect(def.items).toHaveLength(20);
    expect(def.pagination).toEqual({ page: 1, pageSize: 20, total: 25 });
    const big = listCatalog(store, 'demo', 'localidades', { pageSize: '5000' });
    expect(big.pagination.pageSize).toBe(1000);
    expect(big.items).toHaveLength(25);
  });

  it('falls back to defaults for invalid paging values', () => {
    const res = listCatalog(storeWithRows(25), 'demo', 'localidades', { page: '0', pageSize: 'abc' });
    expect(res.pagination).toEqual({ page: 1, pageSize: 20, total: 25 });
  });

  it('excludes inactive records from default lists', () => {
    const res = listCatalog(realStore(), 'demo', 'localidades');
    expect(res.pagination.total).toBe(4);
    expect(res.items.map((r: any) => r.id_localidad)).not.toContain('5');
  });

  it('resolves empresa, departamento, provincia and distrito display names', () => {
    const { items } = listCatalog(realStore(), 'demo', 'localidades');
    expect(items[0]).toMatchObject({
      id_localidad: '1',
      empresa: 'COMERCIAL DEMO SAC',
      departamento: 'LIMA',
      provincia: 'LIMA',
      distrito: 'LIMA',
    });
    expect(items[1]).toMatchObject({ empresa: 'COMERCIAL DEMO SAC', distrito: 'ATE' });
    expect(items[2]).toMatchObject({ empresa: 'DISTRIBUIDORA DEMO SRL', departamento: 'CALLAO' });
  });

  it('filters by a field value (case-insensitive contains)', () => {
    const res = listCatalog(realStore(), 'demo', 'localidades', { descripcion: 'ate' });
    expect(res.items.map((r: any) => r.descripcion)).toEqual(['LOCAL ATE']);
    expect(res.pagination.total).toBe(1);
  });

  it('keeps tenants isolated', () => {
    const res = listCatalog(realStore(), 'botica', 'localidades');
    expect(res.items.map((r: any) => r.descripcion)).toEqual(['BOTICA AREQUIPA', 'BOTICA CAMANA']);
  });

  it('rejects an unknown catalog with NOT_FOUND', () => {
    const err = catchError(() => listCatalog(realStore(), 'demo', 'nope'));
    expect([err.status, err.code]).toEqual([404, 'NOT_FOUND']);
  });
});

describe('getRecord', () => {
  it('returns one enriched record and 404s for an unknown id', () => {
    const store = realStore();
    expect(getRecord(store, 'demo', 'localidades', '2')).toMatchObject({
      descripcion: 'LOCAL ATE',
      distrito: 'ATE',
    });
    const err = catchError(() => getRecord(store, 'demo', 'localidades', 'does-not-exist'));
    expect([err.status, err.code]).toEqual([404, 'NOT_FOUND']);
  });
});

describe('createRecord and updateRecord', () => {
  it('creates an active record with a new id that shows up in the list', () => {
    const store = realStore();
    const created = createRecord(store, 'demo', 'localidades', validBody);
    expect(created).toMatchObject({ descripcion: 'LOCAL NUEVO', activo: true, distrito: 'LIMA' });
    expect(created.id_localidad).toBe('6');
    const list = listCatalog(store, 'demo', 'localidades');
    expect(list.pagination.total).toBe(5);
    expect(listCatalog(store, 'botica', 'localidades').pagination.total).toBe(2);
  });

  it('S-MOCK-12 rejects a missing descripcion with a 422 naming the field', () => {
    const { descripcion: _omit, ...body } = validBody;
    const err = catchError(() => createRecord(realStore(), 'demo', 'localidades', body));
    expect(err.status).toBe(422);
    expect(err.details.map((d) => d.field)).toEqual(['descripcion']);
  });

  it('reports every invalid field in a stable order', () => {
    const err = catchError(() =>
      createRecord(realStore(), 'demo', 'localidades', {
        id_empresa: '99',
        descripcion: 'X'.repeat(101),
        id_ubigeo: '15',
      }),
    );
    expect(err.details.map((d) => d.field)).toEqual(['id_empresa', 'descripcion', 'id_ubigeo']);
  });

  it('does not store anything when validation fails', () => {
    const store = realStore();
    catchError(() => createRecord(store, 'demo', 'localidades', { descripcion: '' }));
    expect(listCatalog(store, 'demo', 'localidades').pagination.total).toBe(4);
  });

  it('updates an existing record and re-validates the merged result', () => {
    const store = realStore();
    const updated = updateRecord(store, 'demo', 'localidades', '1', { direccion: 'JR. NUEVA 1' });
    expect(updated).toMatchObject({ id_localidad: '1', descripcion: 'LOCAL CENTRAL', direccion: 'JR. NUEVA 1' });
    const err = catchError(() => updateRecord(store, 'demo', 'localidades', '1', { descripcion: '  ' }));
    expect(err.details.map((d) => d.field)).toEqual(['descripcion']);
    const missing = catchError(() => updateRecord(store, 'demo', 'localidades', 'zzz', validBody));
    expect(missing.status).toBe(404);
  });
});

describe('deleteRecord', () => {
  it('S-MOCK-10 marks the record inactive: hidden from lists, still resolvable by id', () => {
    const store = realStore();
    deleteRecord(store, 'demo', 'localidades', '1');
    const ids = listCatalog(store, 'demo', 'localidades').items.map((r: any) => r.id_localidad);
    expect(ids).toEqual(['2', '3', '4']);
    expect(getRecord(store, 'demo', 'localidades', '1')).toMatchObject({ id_localidad: '1', activo: false });
  });

  it('404s for an unknown id', () => {
    const err = catchError(() => deleteRecord(realStore(), 'demo', 'localidades', 'nope'));
    expect(err.status).toBe(404);
  });
});
