import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { CHILD_REGISTRY, CHILD_SEED } from '../core/children.fixture';
import { createStore } from '../core/store.js';
import { loadSeed } from './loadSeed.js';

const real = new URL('../data', import.meta.url);
const dir = mkdtempSync(join(tmpdir(), 'children-seed-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('S-REG-20 child seeds inside parent seed rows (R-REG-14)', () => {
  it('splits them into the child section at snapshot; the nested rows equal the seeded ones', () => {
    cpSync(real, dir, { recursive: true, filter: (src) => !src.includes('catalogs') });
    mkdirSync(join(dir, 'catalogs'));
    for (const name of ['clientes', 'cuentas']) writeFileSync(join(dir, 'catalogs', `${name}.json`), JSON.stringify({ demo: (CHILD_SEED as any)[name].a }));
    const store = createStore(loadSeed(dir, CHILD_REGISTRY), CHILD_REGISTRY);
    const data = store.data('demo');
    expect(data['clientes/direcciones'].map((r: any) => [r.id, r.id_clientes, r.direccion, r.estado, r.activo])).toEqual([
      ['1', '001', 'AV 1', 'A', undefined], ['2', '001', 'AV 2', 'D', undefined], ['3', '001', 'AV 3', 'A', false],
    ]);
    expect(data['clientes/contactos'].map((r: any) => [r.id, r.id_clientes])).toEqual([['1', '001'], ['2', '003']]);
    expect(data['clientes'].every((r: any) => !('direcciones' in r) && !('contactos' in r))).toBe(true);
    // The empresa scope of the parent reaches the child rows, so the nested list can filter them.
    expect(data['cuentas/contactos']).toEqual([{ id: '1', id_cuentas: '001', id_empresa: '1', nombre: 'UNO', estado: 'A' }]);
    expect(store.data('botica')['clientes/direcciones']).toEqual([]);
  });

  it('keeps the section independent of the seed and restores it on reset', () => {
    const store = createStore(CHILD_SEED, CHILD_REGISTRY);
    store.data('a')['clientes/contactos'].length = 0;
    store.reset();
    expect(store.data('a')['clientes/contactos']).toHaveLength(2);
  });
});
