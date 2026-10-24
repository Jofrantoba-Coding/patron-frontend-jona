import { resolveWhere, scopeFilter } from './context.js';
import { MockError, notFound } from './errors.js';
import { LOOKUP_RULES } from './rules.js';
import { ACTIVE_KEY, existsRow, rowsOf, viaValue } from './validators.js';

/**
 * Filter keys the options endpoint accepts for a target: its own ref fields, the
 * `filterKey` of every select that depends on a parent over it, and the keys of
 * the static `where` those selects declare (the UI forwards them as parameters).
 * @param {any} store @param {any} target
 */
export function acceptedKeys(store, target) {
  const keys = new Set([...target.refs.map((/** @type {any} */ ref) => ref.field), ...Object.keys(target.lookupFilters ?? {})]);
  for (const entry of store.registry.entries) {
    for (const f of entry.fields.filter((/** @type {any} */ f) => f.kind === 'select' && f.source.catalog === target.slug)) {
      for (const parent of f.dependsOn ?? []) keys.add(parent.filterKey);
      for (const key of Object.keys(f.source.where ?? {})) keys.add(key);
    }
  }
  return keys;
}

/**
 * The option name of a row: the `optionLabel` field, or several joined with " - " (an empty one is left out).
 * @param {any} entry @param {any} row
 */
const labelOf = (entry, row) => [entry.optionLabel ?? 'descripcion'].flat().map((name) => String(row[name] ?? '')).filter(Boolean).join(' - ');

/**
 * Options of a registry catalog for a select (R-MOCK-16): active rows only, each
 * filter an EXACT match (`"1"` never matches `"10"`), named by `optionLabel`. A
 * filter value of `$session.empresa` is the session empresa. Unknown values give
 * an empty list; a key the registry does not declare is a 400.
 * @param {any} store @param {string} tenantId @param {string} slug
 * @param {Record<string, string>} [filters] @param {import('./context.js').RequestContext} [ctx]
 */
export function lookupOptions(store, tenantId, slug, filters = {}, ctx) {
  // A source answers through its named rule; a query key listed in `lookupRuleBy` (`has`) hands the request to that key's rule instead.
  const source = store.registry.sources[slug];
  const byKey = Object.entries(source?.lookupRuleBy ?? {}).find(([key]) => filters[key] !== undefined);
  const rule = LOOKUP_RULES[byKey?.[1] ?? source?.lookupRule];
  const entry = store.registry.bySlug.get(slug);
  if (!entry && !rule) throw notFound(`Unknown catalog: ${slug}`);
  const accepted = rule ? new Set(rule.keys) : acceptedKeys(store, entry);
  const unknown = Object.keys(filters).find((key) => !accepted.has(key));
  if (unknown) throw new MockError(400, 'INVALID_FILTER', `Unknown filter "${unknown}" for ${slug}`);
  if (rule) return { items: structuredClone(rule.options(store, filters, tenantId)) };
  // A `via` filter takes the key of a row of another catalog and matches the value that row holds (SubFamilia SUNAT by familia).
  /** @type {[string, any][]} */
  const exact = [];
  /** @type {((row: any) => boolean)[]} */
  const tests = [];
  for (const [key, value] of Object.entries(resolveWhere(store, tenantId, filters, ctx))) {
    // An `exists` filter keeps the rows that have a matching row in another catalog.
    const { exists } = entry.lookupFilters?.[key] ?? {};
    if (exists) {
      tests.push((row) => existsRow(store, tenantId, exists, key, value, row, entry.idKey, ctx));
      continue;
    }
    const via = entry.lookupFilters?.[key]?.via;
    if (!via) {
      exact.push([key, value]);
      continue;
    }
    const held = viaValue(store, tenantId, via, value);
    // No such row, or a row that holds no value: nothing can match.
    if (held === '') return { items: [] };
    exact.push([via.as, held]);
  }
  const items = rowsOf(store, tenantId, entry)
    .filter(scopeFilter(store, tenantId, entry, ctx))
    .filter((/** @type {any} */ r) => r[ACTIVE_KEY] !== false && exact.every(([key, value]) => String(r[key] ?? '') === String(value)) && tests.every((test) => test(r)))
    .map((/** @type {any} */ r) => ({ id: String(r[entry.idKey]), name: labelOf(entry, r) }));
  return { items };
}
