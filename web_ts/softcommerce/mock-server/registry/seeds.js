/** @param {unknown} value */
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Collects the seed of every registry entry (R-REG-5), shared by the Node loader
 * and the in-browser seed so neither keeps a hardcoded list.
 * - `tenant` / `empresa` entries: `{ <tenantId>: row[] }`
 * - `shared` entries: `row[]`
 * Entries with `seed: null` live in a W1 section loaded by the W1 loader.
 * @param {{ entries: any[] }} registry
 * @param {(name: string) => unknown} load Returns the parsed file, or throws/returns undefined when it is missing.
 * @returns {Record<string, any>} Seed sections keyed by the entry `section`.
 */
export function collectSeeds(registry, load) {
  /** @type {Record<string, any>} */
  const seeds = {};
  for (const entry of registry.entries) {
    if (entry.seed === null) continue;
    const file = `catalogs/${entry.seed}.json`;
    const data = load(entry.seed);
    if (data === undefined) throw new Error(`Cannot load seed file ${file}: not found`);
    const valid = entry.scope === 'shared'
      ? Array.isArray(data)
      : isObject(data) && Object.values(/** @type {object} */ (data)).every(Array.isArray);
    if (!valid) {
      const expected = entry.scope === 'shared' ? 'an array of rows' : 'an object of row arrays keyed by tenant';
      throw new Error(`Invalid seed file ${file}: expected ${expected}`);
    }
    seeds[entry.section] = data;
  }
  return seeds;
}
