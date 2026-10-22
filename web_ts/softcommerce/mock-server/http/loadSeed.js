import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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

/**
 * Reads the seed JSON files from a directory (R-MOCK-5). Replacing any file,
 * such as `menu.json`, changes the served data with no code change.
 * @param {string} dataDir
 * @returns {Record<string, any>}
 */
export function loadSeed(dataDir) {
  /** @type {Record<string, any>} */
  const seed = {};
  for (const [file, key] of Object.entries(SEED_FILES)) {
    const path = join(dataDir, `${file}.json`);
    try {
      seed[key] = JSON.parse(readFileSync(path, 'utf8'));
    } catch (error) {
      throw new Error(`Cannot load seed file ${path}: ${/** @type {Error} */ (error).message}`);
    }
  }
  return seed;
}
