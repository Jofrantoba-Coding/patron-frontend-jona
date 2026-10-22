import { resolveWhere, scopeFilter } from './context.js';
import { MockError, notFound } from './errors.js';
import { ACTIVE_KEY, rowsOf } from './validators.js';

/**
 * Filter keys the options endpoint accepts for a target: its own ref fields, the
 * `filterKey` of every select that depends on a parent over it, and the keys of
 * the static `where` those selects declare (the UI forwards them as parameters).
 * @param {any} store @param {any} target
 */
function acceptedKeys(store, target) {
  const keys = new Set(target.refs.map((/** @type {any} */ ref) => ref.field));
  for (const entry of store.registry.entries) {
    for (const f of entry.fields.filter((/** @type {any} */ f) => f.kind === 'select' && f.source.catalog === target.slug)) {
      for (const parent of f.dependsOn ?? []) keys.add(parent.filterKey);
      for (const key of Object.keys(f.source.where ?? {})) keys.add(key);
    }
  }
  return keys;
}

/**
 * Options of a registry catalog for a select (R-MOCK-16): active rows only, each
 * filter an EXACT match (`"1"` never matches `"10"`), named by `optionLabel`. A
 * filter value of `$session.empresa` is the session empresa. Unknown values give
 * an empty list; a key the registry does not declare is a 400.
 * @param {any} store @param {string} tenantId @param {string} slug
 * @param {Record<string, string>} [filters] @param {import('./context.js').RequestContext} [ctx]
 */
export function lookupOptions(store, tenantId, slug, filters = {}, ctx) {
  const entry = store.registry.bySlug.get(slug);
  if (!entry) throw notFound(`Unknown catalog: ${slug}`);
  const accepted = acceptedKeys(store, entry);
  const unknown = Object.keys(filters).find((key) => !accepted.has(key));
  if (unknown) throw new MockError(400, 'INVALID_FILTER', `Unknown filter "${unknown}" for ${slug}`);
  const exact = Object.entries(resolveWhere(store, tenantId, filters, ctx));
  const items = rowsOf(store, tenantId, entry)
    .filter(scopeFilter(store, tenantId, entry, ctx))
    .filter((/** @type {any} */ r) => r[ACTIVE_KEY] !== false && exact.every(([key, value]) => String(r[key] ?? '') === String(value)))
    .map((/** @type {any} */ r) => ({ id: String(r[entry.idKey]), name: String(r[entry.optionLabel ?? 'descripcion'] ?? '') }));
  return { items };
}
