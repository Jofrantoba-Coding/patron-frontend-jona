import { describe, expect, it } from 'vitest';
import { MockError } from './errors.js';
import { createStore } from './store.js';
import { readSeed, tinySeed } from './test-helpers.js';

describe('createStore', () => {
  it('S-MOCK-14 reset restores the seeded localidades after a create', () => {
    const store = createStore(tinySeed());
    const rows = store.data('a').localidades;
    rows.push({ id_localidad: 'NEW', descripcion: 'CREATED', activo: true });
    expect(store.data('a').localidades).toHaveLength(2);

    store.reset();

    expect(store.data('a').localidades).toEqual(tinySeed().localidades.a);
  });

  it('S-MOCK-14 reset also restores deleted and edited rows', () => {
    const store = createStore(tinySeed());
    store.data('a').localidades[0].descripcion = 'EDITED';
    store.data('b').localidades.length = 0;

    store.reset();

    expect(store.data('a').localidades[0].descripcion).toBe('ONE');
    expect(store.data('b').localidades).toHaveLength(1);
  });

  it('isolates datasets per tenant', () => {
    const store = createStore(tinySeed());
    store.data('a').localidades.push({ id_localidad: 'ONLY-A', activo: true });

    expect(store.data('a').localidades.map((r: any) => r.id_localidad)).toEqual(['L1', 'ONLY-A']);
    expect(store.data('b').localidades.map((r: any) => r.id_localidad)).toEqual(['L2']);
    expect(store.data('a').params.INICIO_ACTIVIDADES).toBe('2020-01-01');
    expect(store.data('b').params.INICIO_ACTIVIDADES).toBe('2021-06-01');
  });

  it('never mutates the seed object it was built from', () => {
    const seed = tinySeed();
    const store = createStore(seed);
    store.data('a').localidades.push({ id_localidad: 'X', activo: true });
    expect(seed.localidades.a).toHaveLength(1);
  });

  it('lists tenants and rejects unknown ones with TENANT_NOT_FOUND', () => {
    const store = createStore(tinySeed());
    expect(store.tenants()).toEqual([
      { id: 'a', name: 'Tenant A' },
      { id: 'b', name: 'Tenant B' },
    ]);
    expect(store.hasTenant('a')).toBe(true);
    expect(store.hasTenant('nope')).toBe(false);
    expect(() => store.data('nope')).toThrow(MockError);
    try {
      store.data('nope');
    } catch (e) {
      expect((e as MockError).code).toBe('TENANT_NOT_FOUND');
      expect((e as MockError).status).toBe(404);
    }
  });

  it('exposes shared (tenant-independent) seed sections', () => {
    const store = createStore(readSeed());
    expect(store.shared.menu.length).toBeGreaterThan(0);
    expect(store.shared.ubigeo.length).toBeGreaterThan(0);
    expect(store.shared.users.length).toBeGreaterThan(0);
  });

  it('boots from the real seed files with two isolated tenants', () => {
    const store = createStore(readSeed());
    const ids = store.tenants().map((t: any) => t.id);
    expect(ids.length).toBeGreaterThanOrEqual(2);
    for (const id of ids) {
      expect(store.data(id).localidades.length).toBeGreaterThan(0);
      expect(store.data(id).empresas.length).toBeGreaterThan(0);
    }
    expect(store.data(ids[0]).localidades).not.toEqual(store.data(ids[1]).localidades);
  });
});
