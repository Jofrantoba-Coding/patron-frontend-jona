import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REGISTRY } from '../registry/index.js';
import { collectSeeds } from '../registry/seeds.js';

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
};

/** @param {string} path */
function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot load seed file ${path}: ${/** @type {Error} */ (error).message}`);
  }
}

/**
 * Reads the seed JSON files from a directory (R-MOCK-5). Replacing any file,
 * such as `menu.json`, changes the served data with no code change. Catalog seeds
 * are read from `<dataDir>/catalogs/<entry.seed>.json` for every registry entry.
 * @param {string} dataDir
 * @param {{ entries: any[] }} [registry]
 * @returns {Record<string, any>}
 */
export function loadSeed(dataDir, registry = REGISTRY) {
  /** @type {Record<string, any>} */
  const seed = {};
  for (const [file, key] of Object.entries(SEED_FILES)) seed[key] = readJson(join(dataDir, `${file}.json`));
  return { ...seed, ...collectSeeds(registry, (name) => readJson(join(dataDir, 'catalogs', `${name}.json`))) };
}
