import { readFileSync } from 'node:fs';

/** Seed file name -> seed key (kebab-case file names map to camelCase keys). */
const SEED_FILES = {
  users: 'users',
  tenants: 'tenants',
  empresas: 'empresas',
  'puntos-venta': 'puntosVenta',
  ubigeo: 'ubigeo',
  localidades: 'localidades',
  params: 'params',
  menu: 'menu',
  permissions: 'permissions',
} as const;

/** Reads the real seed JSON files (test-only; the core itself never touches fs). */
export function readSeed(): Record<string, any> {
  const seed: Record<string, any> = {};
  for (const [file, key] of Object.entries(SEED_FILES)) {
    const url = new URL(`../data/${file}.json`, import.meta.url);
    seed[key] = JSON.parse(readFileSync(url, 'utf8'));
  }
  return seed;
}

/** Minimal two-tenant seed with distinct data per tenant, for isolation tests. */
export function tinySeed(): Record<string, any> {
  return {
    tenants: [
      { id: 'a', name: 'Tenant A' },
      { id: 'b', name: 'Tenant B' },
    ],
    users: [],
    menu: [],
    permissions: {},
    ubigeo: [],
    empresas: { a: [{ id: '1', name: 'Empresa A' }], b: [{ id: '2', name: 'Empresa B' }] },
    puntosVenta: { a: [], b: [] },
    localidades: {
      a: [{ id_localidad: 'L1', descripcion: 'ONE', activo: true }],
      b: [{ id_localidad: 'L2', descripcion: 'TWO', activo: true }],
    },
    params: { a: { INICIO_ACTIVIDADES: '2020-01-01' }, b: { INICIO_ACTIVIDADES: '2021-06-01' } },
  };
}
