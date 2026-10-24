import { ACTIVE_KEY, rowsOf } from './validators.js';

/**
 * Derived values of a parent over the rows of one of its children (D27a): `aggregate: [{ as, child, op: 'count' | 'sum', field?, where? }]`. `count` counts the rows, `sum`
 * adds `field`; `where` keeps the rows whose columns equal the given text (`{ estado: 'A' }` is the active ones). A logically deleted row never counts. The value is never stored
 * and never written by a body: the server adds it to every answer (`catalog.js` `enrich`) and the register recomputes it from its grid with the same pure functions below.
 * @typedef {{ as: string, child: string, op: 'count' | 'sum', field?: string, where?: Record<string, unknown> }} AggregateDef
 */

export const AGGREGATE_OPS = ['count', 'sum'];

/** The sum is kept to cents so a float tail never shows. @param {number} n */
const cents = (n) => Math.round(n * 100) / 100;

/**
 * One aggregate over the rows of its child.
 * @param {AggregateDef} def @param {Record<string, any>[]} rows
 */
export function aggregateValue(def, rows) {
  const live = rows.filter((row) => row[ACTIVE_KEY] !== false && Object.entries(def.where ?? {}).every(([key, value]) => String(row[key] ?? '') === String(value)));
  if (def.op === 'count') return live.length;
  return cents(live.reduce((total, row) => total + (Number(row[/** @type {string} */ (def.field)]) || 0), 0));
}

/**
 * Every aggregate of an entry, keyed by `as`.
 * @param {AggregateDef[]} defs @param {(child: string) => Record<string, any>[]} rowsOfChild the rows of the named child (already limited to one parent)
 */
export const aggregateValues = (defs, rowsOfChild) => Object.fromEntries(defs.map((def) => [def.as, aggregateValue(def, rowsOfChild(def.child))]));

/**
 * The aggregates of one stored parent row, from the child sections of the store.
 * @param {any} store @param {string} tenantId @param {any} entry @param {Record<string, any>} row
 */
export function aggregatesOf(store, tenantId, entry, row) {
  if (!entry.aggregate?.length) return {};
  return aggregateValues(entry.aggregate, (/** @type {string} */ name) => {
    const child = store.registry.bySlug.get(`${entry.slug}/${name}`);
    return rowsOf(store, tenantId, child).filter((/** @type {any} */ r) => String(r[child.parentKey]) === String(row[entry.idKey]));
  });
}
