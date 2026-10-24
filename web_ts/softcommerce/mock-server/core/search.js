import { acceptedKeys } from './lookups.js';

/**
 * The terms of a free-text `q` (R-MOCK-20): split on whitespace, lowercased, blanks dropped. A blank `q` has no terms and filters nothing.
 * @param {unknown} q @returns {string[]}
 */
export const searchTerms = (q) => String(q ?? '').toLowerCase().split(/\s+/).filter(Boolean);

/**
 * Whether EVERY term is contained in at least one of the search fields of a row. The match is literal (`includes`, never a pattern), so `%` and `.*`
 * only match a row that holds those characters.
 * @param {Record<string, any>} row @param {string[]} fields @param {string[]} terms
 */
export const matchesTerms = (row, fields, terms) =>
  terms.every((term) => fields.some((name) => String(row[name] ?? '').toLowerCase().includes(term)));

/**
 * Keys the list route accepts besides `page`, `pageSize` and `q` (R-MOCK-20): the entry fields (stored-only columns included), its joined display keys,
 * the `<name>_label` of an options field, and the exact keys of R-MOCK-16 (ref fields, `dependsOn` filter keys, lookup filters).
 * @param {any} store @param {any} entry @returns {Set<string>}
 */
export function acceptedListKeys(store, entry) {
  const keys = new Set([
    ...entry.fields.map((/** @type {any} */ f) => f.name),
    ...(entry.joins ?? []).map((/** @type {any} */ j) => j.as),
    ...entry.fields.filter((/** @type {any} */ f) => f.kind === 'options').map((/** @type {any} */ f) => `${f.name}_label`),
    ...Object.keys(entry.constants ?? {}),
    ...(entry.stamp ?? []),
    ...(entry.derive ?? []).map((/** @type {any} */ d) => d.target),
  ]);
  for (const key of acceptedKeys(store, entry)) keys.add(key);
  return keys;
}

/**
 * The keys the list route matches EXACTLY: the plain lookup filter keys the entry declares (`codigo_subfamilia_sunat`, R-MOCK-16). A `via`, `exists` or `rule`
 * filter has its own meaning and stays a contains match here, and so does a ref field: the generic list keeps its W2 substring matching (R-MOCK-9, S-MOCK-30).
 * @param {any} entry @returns {Set<string>}
 */
export function exactListKeys(entry) {
  const keys = new Set();
  for (const [key, filter] of Object.entries(entry.lookupFilters ?? {})) {
    if (!(/** @type {any} */ (filter).via || /** @type {any} */ (filter).exists || /** @type {any} */ (filter).rule)) keys.add(key);
  }
  return keys;
}
