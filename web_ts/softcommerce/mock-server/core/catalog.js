import { MockError, methodNotAllowed, modeNotSupported, notFound } from './errors.js';
import { joinLabel } from './lookups.js';
import { acceptedListKeys, exactListKeys, matchesTerms, searchTerms } from './search.js';
import { scopeFilter, stampsOf } from './context.js';
import { cascadeDelete, planChildren } from './children.js';
import { blankHidden, derivedValues, withDefaults, withRuleDerived } from './stored.js';
import { ACTIVE_KEY, pickWritable, positiveInt, rowsOf, targetOf, validateRecord } from './validators.js';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 1000;

/** Modes that permit each write verb (CLONE is a create). */
const WRITE_MODES = { POST: ['INSERT', 'CLONE'], PUT: ['UPDATE'], DELETE: ['DELETE'] };

/**
 * @typedef {{ key: string, id: string }} ParentLink The parent a nested call is bound to: the child rows hold the parent id in `key`.
 */

/**
 * The registry entry behind a route slug; unknown slugs are a 404. A child entry (`parent/name`) answers only a nested call, which passes its `link`.
 * @param {any} store @param {string} catalog @param {ParentLink} [link]
 */
function entryOf(store, catalog, link) {
  const entry = store.registry.bySlug.get(catalog);
  if (!entry || (entry.parent !== undefined && !link)) throw notFound(`Unknown catalog: ${catalog}`);
  return entry;
}

/**
 * The entry for a write: read-only lookups answer 405 `METHOD_NOT_ALLOWED`, and a
 * verb outside `modes` answers 405 `MODE_NOT_SUPPORTED` (R-REG-10, R-REG-11).
 * @param {any} store @param {string} catalog @param {keyof typeof WRITE_MODES} verb @param {ParentLink} [link]
 */
function writableEntry(store, catalog, verb, link) {
  const entry = entryOf(store, catalog, link);
  if (entry.readOnly) throw methodNotAllowed(`${catalog} is read-only`);
  if (!WRITE_MODES[verb].some((mode) => entry.modes.includes(mode))) throw modeNotSupported(`${catalog} does not support ${verb}`);
  return entry;
}

/**
 * Adds the joined display names (R-REG-8) and `<name>_label` for options fields
 * (R-MOCK-14). A join over a missing or inactive target is an empty string.
 * @param {any} store @param {string} tenantId @param {any} entry @param {any} row
 * @param {import('./context.js').RequestContext} [ctx]
 */
function enrich(store, tenantId, entry, row, ctx) {
  const out = { ...row };
  for (const join of entry.joins ?? []) {
    const ref = entry.refs.find((/** @type {any} */ r) => r.field === join.ref);
    const target = targetOf(store, tenantId, ref.catalog, ctx, false);
    const value = String(row[join.ref] ?? '');
    const key = join.prefixLen ? value.slice(0, join.prefixLen) : value;
    const found = target.rows.find((/** @type {any} */ r) => String(r[target.idKey]) === key);
    const active = found && (!target.activeKey || found[target.activeKey] !== false);
    // `display` is one field of the target, or a list joined with " - " (the optionLabel a lookup join carries, D3).
    out[join.as] = active ? joinLabel(join.display, found) : '';
  }
  for (const f of entry.fields.filter((/** @type {any} */ f) => f.kind === 'options')) {
    out[`${f.name}_label`] = f.options.find((/** @type {any} */ o) => o.value === String(row[f.name]))?.label ?? '';
  }
  return out;
}

/**
 * Lists active records with field filters and paging (R-MOCK-3).
 * @param {any} store @param {string} tenantId @param {string} catalog
 * @param {Record<string, any>} [query] `page`, `pageSize` and `<field>=` filters.
 * @param {import('./context.js').RequestContext} [ctx] Session context; `empresa`-scope entries need it.
 * @param {ParentLink} [link] Lists only the child rows of this parent (nested route).
 */
export function listCatalog(store, tenantId, catalog, query = {}, ctx, link) {
  const entry = entryOf(store, catalog, link);
  const { page: rawPage, pageSize: rawSize, q, ...filters } = query;
  const page = positiveInt(rawPage, 1);
  const pageSize = positiveInt(rawSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const accepted = acceptedListKeys(store, entry);
  const unknown = Object.keys(filters).find((key) => !accepted.has(key));
  if (unknown) throw new MockError(400, 'INVALID_FILTER', `Unknown filter "${unknown}" for ${catalog}`);
  const terms = searchTerms(q);
  let rows = rowsOf(store, tenantId, entry)
    .filter(scopeFilter(store, tenantId, entry, ctx))
    .filter(ofParent(link))
    .filter((/** @type {any} */ r) => r[ACTIVE_KEY] !== false)
    .map((/** @type {any} */ r) => enrich(store, tenantId, entry, r, ctx));
  // `q` (R-MOCK-20): every term in some declared search field; an entry with no `search` has nothing to match, so the list is empty.
  if (terms.length > 0) rows = rows.filter((/** @type {any} */ r) => matchesTerms(r, entry.search ?? [], terms));
  // A declared lookup filter key is exact (`1` never matches `10`, R-MOCK-16 on this route too); every other key is a contains match (R-MOCK-9).
  const exact = exactListKeys(entry);
  for (const [field, value] of Object.entries(filters)) {
    const needle = String(value).toLowerCase();
    rows = rows.filter((/** @type {any} */ r) => {
      const text = String(r[field] ?? '').toLowerCase();
      return exact.has(field) ? text.trim() === needle.trim() : text.includes(needle);
    });
  }
  const start = (page - 1) * pageSize;
  return { items: rows.slice(start, start + pageSize), pagination: { page, pageSize, total: rows.length } };
}

/** Row filter of a nested call: only the rows of the linked parent. @param {ParentLink} [link] @returns {(row: any) => boolean} */
const ofParent = (link) => (link ? (row) => String(row[link.key]) === link.id : () => true);

/** Finds one record, active or not, within the session scope (and the linked parent). Throws 404 when missing. */
function findRow(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {any} */ entry, /** @type {string} */ id, /** @type {any} */ ctx, /** @type {ParentLink | undefined} */ link) {
  const inScope = scopeFilter(store, tenantId, entry, ctx);
  const inParent = ofParent(link);
  const row = rowsOf(store, tenantId, entry).find((/** @type {any} */ r) => r[entry.idKey] === id && inScope(r) && inParent(r));
  if (!row) throw notFound(`${entry.slug} ${id} not found`);
  return row;
}

/** @param {any} store @param {string} tenantId @param {string} catalog @param {string} id @param {import('./context.js').RequestContext} [ctx] @param {ParentLink} [link] */
export function getRecord(store, tenantId, catalog, id, ctx, link) {
  const entry = entryOf(store, catalog, link);
  const row = findRow(store, tenantId, entry, id, ctx, link);
  // A deactivated child still resolves; a logically deleted one does not (R-MOCK-19). A top-level record keeps the W2 DETAIL behavior.
  if (link && row[ACTIVE_KEY] === false) throw notFound(`${entry.slug} ${id} not found`);
  return enrich(store, tenantId, entry, row, ctx);
}

/**
 * Creates a record. A parent body may carry `children` (R-MOCK-19): the parent, then every child op, are validated before anything is written, so the
 * write is atomic. A nested call passes the `link` of its parent instead.
 * @param {any} store @param {string} tenantId @param {string} catalog @param {Record<string, any>} body @param {import('./context.js').RequestContext} [ctx] @param {ParentLink} [link]
 */
export function createRecord(store, tenantId, catalog, body, ctx, link) {
  const entry = writableEntry(store, catalog, 'POST', link);
  // Session values come from the context, never from the body (R-MOCK-13).
  const stamps = stampsOf(store, tenantId, entry, ctx);
  const record = withRuleDerived(entry, blankHidden(entry, withDefaults(entry, pickWritable(entry, body))));
  validateRecord(store, tenantId, entry, record, { ctx, mode: 'INSERT', parentId: link?.id });
  const plan = link ? null : planChildren(store, tenantId, entry, body.children, { ctx });
  const rows = rowsOf(store, tenantId, entry);
  // The server owns the code (R-MOCK-13): next number, zero-padded to `codeWidth`.
  const next = rows.reduce((/** @type {number} */ max, /** @type {any} */ r) => Math.max(max, Number(r[entry.idKey]) || 0), 0) + 1;
  // Constants and derived columns are the server's: the body never reaches them (R-REF-9).
  const created = { [entry.idKey]: String(next).padStart(entry.codeWidth, '0'), ...record, ...entry.constants, ...derivedValues(entry, record), ...stamps, ...(link ? { [link.key]: link.id } : {}), [ACTIVE_KEY]: true };
  rows.push(created);
  plan?.apply(created[entry.idKey]);
  return enrich(store, tenantId, entry, created, ctx);
}

/** @param {any} store @param {string} tenantId @param {string} catalog @param {string} id @param {Record<string, any>} body @param {import('./context.js').RequestContext} [ctx] @param {ParentLink} [link] */
export function updateRecord(store, tenantId, catalog, id, body, ctx, link) {
  const entry = writableEntry(store, catalog, 'PUT', link);
  const stamps = stampsOf(store, tenantId, entry, ctx);
  const row = findRow(store, tenantId, entry, id, ctx, link);
  if (link && row[ACTIVE_KEY] === false) throw notFound(`${entry.slug} ${id} not found`);
  const merged = withRuleDerived(entry, blankHidden(entry, { ...row, ...pickWritable(entry, body) }));
  validateRecord(store, tenantId, entry, merged, { selfId: id, ctx, mode: 'UPDATE', parentId: link?.id });
  const plan = link ? null : planChildren(store, tenantId, entry, body.children, { ctx, parentId: id });
  Object.assign(row, merged, derivedValues(entry, merged), stamps);
  plan?.apply(id);
  return enrich(store, tenantId, entry, row, ctx);
}

/**
 * Logical delete (R-MOCK-7): flags the record inactive, never removes it. A child follows its `removal` kind (R-MD-4): `deactivate` sets `estado` `D`
 * and keeps the row listed; `none` has no delete.
 */
export function deleteRecord(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {string} */ catalog, /** @type {string} */ id, /** @type {import('./context.js').RequestContext} */ ctx = {}, /** @type {ParentLink | undefined} */ link = undefined) {
  const entry = writableEntry(store, catalog, 'DELETE', link);
  if (entry.removal === 'none') throw modeNotSupported(`${catalog} rows cannot be removed`);
  const row = findRow(store, tenantId, entry, id, ctx, link);
  if (link && row[ACTIVE_KEY] === false) throw notFound(`${entry.slug} ${id} not found`);
  if (entry.removal === 'deactivate') row.estado = 'D';
  else row[ACTIVE_KEY] = false;
  // A logical delete of a parent deletes all its children; children never block it (R-MOCK-21).
  if (!link) cascadeDelete(store, tenantId, entry, row);
}
