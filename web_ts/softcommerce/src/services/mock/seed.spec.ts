import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../../mock-server/registry/index.js';
import { collectSeeds } from '../../../mock-server/registry/seeds.js';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { seed } from './seed';

const entry = (slug: string, scope: string) => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope, seed: slug, messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
});
const registry = validateRegistry([entry('aduanas', 'tenant'), entry('monedas', 'shared')]);

describe('in-browser seed registers catalog files from the registry', () => {
  it('maps each seed file to the entry section by scope shape', () => {
    const files: Record<string, unknown> = { aduanas: { demo: [{ id_aduanas: '1' }] }, monedas: [{ id_monedas: '1' }] };
    expect(collectSeeds(registry, (name) => files[name])).toEqual({ aduanas: files.aduanas, monedas: files.monedas });
  });

  it('S-REG-7 fails at load naming the file when a seed is missing or has the wrong shape', () => {
    expect(() => collectSeeds(registry, () => undefined)).toThrow(/aduanas\.json/);
    expect(() => collectSeeds(registry, (name) => (name === 'aduanas' ? [] : []))).toThrow(/aduanas\.json/);
    expect(() => collectSeeds(registry, (name) => (name === 'aduanas' ? { demo: [] } : {}))).toThrow(/monedas\.json/);
  });

  it('keeps the W1 seed keys and adds one section per registry catalog file', () => {
    const catalogSections = REGISTRY.entries.filter((e: any) => e.seed !== null).map((e: any) => e.section);
    expect(Object.keys(seed).sort()).toEqual(
      ['empresas', 'localidades', 'menu', 'params', 'permissions', 'puntosVenta', 'tenants', 'ubigeo', 'users', ...catalogSections].sort(),
    );
  });
});
