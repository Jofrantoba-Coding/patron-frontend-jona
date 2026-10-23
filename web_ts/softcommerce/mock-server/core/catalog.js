import { methodNotAllowed, modeNotSupported, notFound } from './errors.js';
import { ACTIVE_KEY, pickWritable, positiveInt, rowsOf, targetOf, validateRecord } from './validators.js';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 1000;

/** Modes that permit each write verb (CLONE is a create). */
const WRITE_MODES = { POST: ['INSERT', 'CLONE'], PUT: ['UPDATE'], DELETE: ['DELETE'] };

/** The registry entry behind a route slug; unknown slugs are a 404. @param {any} store @param {string} catalog */
function entryOf(store, catalog) {
  const entry = store.registry.bySlug.get(catalog);
  if (!entry) throw notFound(`Unknown catalog: ${catalog}`);
  return entry;
}

/**
 * The entry for a write: read-only lookups answer 405 `METHOD_NOT_ALLOWED`, and a
 * verb outside `modes` answers 405 `MODE_NOT_SUPPORTED` (R-REG-10, R-REG-11).
 * @param {any} store @param {string} catalog @param {keyof typeof WRITE_MODES} verb
 */
function writableEntry(store, catalog, verb) {
  const entry = entryOf(store, catalog);
  if (entry.readOnly) throw methodNotAllowed(`${catalog} is read-only`);
  if (!WRITE_MODES[verb].some((mode) => entry.modes.includes(mode))) throw modeNotSupported(`${catalog} does not support ${verb}`);
  return entry;
}

/**
 * Adds the joined display names (R-REG-8) and `<name>_label` for options fields
 * (R-MOCK-14). A join over a missing or inactive target is an empty string.
 * @param {any} store @param {string} tenantId @param {any} entry @param {any} row
 */
function enrich(store, tenantId, entry, row) {
  const out = { ...row };
  for (const join of entry.joins ?? []) {
    const ref = entry.refs.find((/** @type {any} */ r) => r.field === join.ref);
    const target = targetOf(store, tenantId, ref.catalog);
    const value = String(row[join.ref] ?? '');
    const key = join.prefixLen ? value.slice(0, join.prefixLen) : value;
    const found = target.rows.find((/** @type {any} */ r) => String(r[target.idKey]) === key);
    const active = found && (!target.activeKey || found[target.activeKey] !== false);
    out[join.as] = active ? String(found[join.display] ?? '') : '';
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
 */
export function listCatalog(store, tenantId, catalog, query = {}) {
  const entry = entryOf(store, catalog);
  const { page: rawPage, pageSize: rawSize, ...filters } = query;
  const page = positiveInt(rawPage, 1);
  const pageSize = positiveInt(rawSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  let rows = rowsOf(store, tenantId, entry)
    .filter((/** @type {any} */ r) => r[ACTIVE_KEY] !== false)
    .map((/** @type {any} */ r) => enrich(store, tenantId, entry, r));
  for (const [field, value] of Object.entries(filters)) {
    const needle = String(value).toLowerCase();
    rows = rows.filter((/** @type {any} */ r) => String(r[field] ?? '').toLowerCase().includes(needle));
  }
  const start = (page - 1) * pageSize;
  return { items: rows.slice(start, start + pageSize), pagination: { page, pageSize, total: rows.length } };
}

/** Finds one record, active or not. Throws 404 when missing. */
function findRow(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {any} */ entry, /** @type {string} */ id) {
  const row = rowsOf(store, tenantId, entry).find((/** @type {any} */ r) => r[entry.idKey] === id);
  if (!row) throw notFound(`${entry.slug} ${id} not found`);
  return row;
}

/** @param {any} store @param {string} tenantId @param {string} catalog @param {string} id */
export function getRecord(store, tenantId, catalog, id) {
  const entry = entryOf(store, catalog);
  return enrich(store, tenantId, entry, findRow(store, tenantId, entry, id));
}

/** @param {any} store @param {string} tenantId @param {string} catalog @param {Record<string, any>} body */
export function createRecord(store, tenantId, catalog, body) {
  const entry = writableEntry(store, catalog, 'POST');
  const record = pickWritable(entry, body);
  validateRecord(store, tenantId, entry, record);
  const rows = rowsOf(store, tenantId, entry);
  // The server owns the code (R-MOCK-13): next number, zero-padded to `codeWidth`.
  const next = rows.reduce((/** @type {number} */ max, /** @type {any} */ r) => Math.max(max, Number(r[entry.idKey]) || 0), 0) + 1;
  const created = { [entry.idKey]: String(next).padStart(entry.codeWidth, '0'), ...record, [ACTIVE_KEY]: true };
  rows.push(created);
  return enrich(store, tenantId, entry, created);
}

/** @param {any} store @param {string} tenantId @param {string} catalog @param {string} id @param {Record<string, any>} body */
export function updateRecord(store, tenantId, catalog, id, body) {
  const entry = writableEntry(store, catalog, 'PUT');
  const row = findRow(store, tenantId, entry, id);
  const merged = { ...row, ...pickWritable(entry, body) };
  validateRecord(store, tenantId, entry, merged, id);
  Object.assign(row, merged);
  return enrich(store, tenantId, entry, row);
}

/** Logical delete (R-MOCK-7): flags the record inactive, never removes it. */
export function deleteRecord(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {string} */ catalog, /** @type {string} */ id) {
  const entry = writableEntry(store, catalog, 'DELETE');
  findRow(store, tenantId, entry, id)[ACTIVE_KEY] = false;
}
