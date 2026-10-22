import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { createStore } from '../core/store.js';
import { tinySeed } from '../core/test-helpers.js';
import { validateRegistry } from '../registry/schema.js';
import { loadSeed } from './loadSeed.js';

const SEED_DIR = fileURLToPath(new URL('../data', import.meta.url));

const entry = (slug: string, scope: string) => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope, seed: slug, messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
});
const registry = validateRegistry([entry('aduanas', 'tenant'), entry('monedas', 'shared'), entry('turnos', 'empresa')]);

const dir = mkdtempSync(join(tmpdir(), 'softcommerce-catalog-seed-'));
cpSync(SEED_DIR, dir, { recursive: true });
mkdirSync(join(dir, 'catalogs'));
writeFileSync(join(dir, 'catalogs', 'aduanas.json'), JSON.stringify({ demo: [{ id_aduanas: '1', descripcion: 'CALLAO', activo: true }] }));
writeFileSync(join(dir, 'catalogs', 'monedas.json'), JSON.stringify([{ id_monedas: '1', descripcion: 'SOLES', activo: true }]));
writeFileSync(join(dir, 'catalogs', 'turnos.json'), JSON.stringify({ demo: [{ id_turnos: '1', descripcion: 'AM', activo: true }] }));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('loadSeed registers catalog seeds from the registry', () => {
  it('S-REG-6 demo gets its rows and botica gets an empty dataset', () => {
    const store = createStore(loadSeed(dir, registry), registry);
    expect(store.data('demo').aduanas).toHaveLength(1);
    expect(store.data('botica').aduanas).toEqual([]);
  });

  it('S-REG-18 shared rows are global; tenant and empresa rows are per tenant', () => {
    const store = createStore(loadSeed(dir, registry), registry);
    expect(store.shared.monedas).toEqual([{ id_monedas: '1', descripcion: 'SOLES', activo: true }]);
    expect(store.data('demo').turnos).toHaveLength(1);
    expect(store.data('botica').turnos).toEqual([]);
    expect('monedas' in store.data('demo')).toBe(false);
  });

  it('S-REG-7 a malformed seed fails at load naming the file', () => {
    const bad = mkdtempSync(join(tmpdir(), 'softcommerce-bad-seed-'));
    cpSync(dir, bad, { recursive: true });
    writeFileSync(join(bad, 'catalogs', 'aduanas.json'), '{ not json');
    expect(() => loadSeed(bad, registry)).toThrow(/aduanas\.json/);
    rmSync(bad, { recursive: true, force: true });
  });

  it('a missing seed file fails at load naming the file', () => {
    expect(() => loadSeed(SEED_DIR, registry)).toThrow(/catalogs[\\/]aduanas\.json/);
  });

  it('W1 seeds are unchanged: no registry means no catalog files and the W1 keys only', () => {
    expect(Object.keys(loadSeed(SEED_DIR)).sort()).toEqual(
      ['empresas', 'localidades', 'menu', 'params', 'permissions', 'puntosVenta', 'tenants', 'ubigeo', 'users'],
    );
    const store = createStore(tinySeed());
    expect(store.data('a').localidades).toHaveLength(1);
  });
});
