import { notFound } from './errors.js';
import { assertValid, positiveInt } from './validators.js';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 1000;

/**
 * Catalog registry. Wave 1 only ships `localidades`; each entry describes how
 * the generic rules (list, paging, logical delete, validation) apply to it.
 */
const CATALOGS = {
  localidades: {
    idKey: 'id_localidad',
    activeKey: 'activo',
    required: ['id_empresa', 'descripcion', 'id_ubigeo'],
    maxLength: { descripcion: 100, direccion: 100 },
    writable: ['id_empresa', 'descripcion', 'direccion', 'id_ubigeo'],
  },
};

/** @param {string} catalog */
function definitionOf(catalog) {
  if (!Object.hasOwn(CATALOGS, catalog)) throw notFound(`Unknown catalog: ${catalog}`);
  return CATALOGS[/** @type {keyof typeof CATALOGS} */ (catalog)];
}

/** @param {any} store @param {string} tenantId @param {string} catalog */
function rowsOf(store, tenantId, catalog) {
  definitionOf(catalog);
  return store.data(tenantId)[catalog];
}

/** @param {any[]} ubigeo @param {string} id */
function ubigeoName(ubigeo, id) {
  return ubigeo.find((u) => u.id === id)?.name ?? '';
}

/**
 * Adds the display names the desktop UI shows (empresa, departamento,
 * provincia, distrito) to a localidad row.
 * @param {any} store @param {string} tenantId @param {any} row
 */
function enrich(store, tenantId, row) {
  const empresa = store.data(tenantId).empresas.find((/** @type {any} */ e) => e.id === row.id_empresa);
  const code = String(row.id_ubigeo ?? '');
  const ubigeo = store.shared.ubigeo;
  return {
    ...row,
    empresa: empresa?.name ?? '',
    departamento: ubigeoName(ubigeo, code.slice(0, 2)),
    provincia: ubigeoName(ubigeo, code.slice(0, 4)),
    distrito: ubigeoName(ubigeo, code.slice(0, 6)),
  };
}

/**
 * Validates a (merged) record and throws a 422 with per-field details.
 * @param {any} store @param {string} tenantId @param {string} catalog @param {Record<string, any>} record
 */
function validate(store, tenantId, catalog, record) {
  assertValid(definitionOf(catalog), record, {
    empresaIds: store.data(tenantId).empresas.map((/** @type {any} */ e) => e.id),
    districtIds: store.shared.ubigeo.map((/** @type {any} */ u) => u.id).filter((/** @type {string} */ id) => id.length === 6),
  });
}

/** @param {Record<string, any>} body @param {string[]} writable */
function pickWritable(body, writable) {
  return Object.fromEntries(writable.filter((k) => k in body).map((k) => [k, body[k]]));
}

/**
 * Lists active records with field filters and paging (R-MOCK-3).
 * @param {any} store @param {string} tenantId @param {string} catalog
 * @param {Record<string, any>} [query] `page`, `pageSize` and `<field>=` filters.
 */
export function listCatalog(store, tenantId, catalog, query = {}) {
  const def = definitionOf(catalog);
  const { page: rawPage, pageSize: rawSize, ...filters } = query;
  const page = positiveInt(rawPage, 1);
  const pageSize = positiveInt(rawSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  let rows = rowsOf(store, tenantId, catalog).filter((/** @type {any} */ r) => r[def.activeKey] !== false);
  for (const [field, value] of Object.entries(filters)) {
    const needle = String(value).toLowerCase();
    rows = rows.filter((/** @type {any} */ r) => String(r[field] ?? '').toLowerCase().includes(needle));
  }
  const start = (page - 1) * pageSize;
  return {
    items: rows.slice(start, start + pageSize).map((/** @type {any} */ r) => enrich(store, tenantId, r)),
    pagination: { page, pageSize, total: rows.length },
  };
}

/** Finds one record, active or not. Throws 404 when missing. */
function findRow(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {string} */ catalog, /** @type {string} */ id) {
  const def = definitionOf(catalog);
  const row = rowsOf(store, tenantId, catalog).find((/** @type {any} */ r) => r[def.idKey] === id);
  if (!row) throw notFound(`${catalog} ${id} not found`);
  return row;
}

/** @param {any} store @param {string} tenantId @param {string} catalog @param {string} id */
export function getRecord(store, tenantId, catalog, id) {
  return enrich(store, tenantId, findRow(store, tenantId, catalog, id));
}

/** @param {any} store @param {string} tenantId @param {string} catalog @param {Record<string, any>} body */
export function createRecord(store, tenantId, catalog, body) {
  const def = definitionOf(catalog);
  const record = pickWritable(body, def.writable);
  validate(store, tenantId, catalog, record);
  const rows = rowsOf(store, tenantId, catalog);
  const nextId = rows.reduce((/** @type {number} */ max, /** @type {any} */ r) => Math.max(max, Number(r[def.idKey]) || 0), 0) + 1;
  const created = { [def.idKey]: String(nextId), ...record, [def.activeKey]: true };
  rows.push(created);
  return enrich(store, tenantId, created);
}

/** @param {any} store @param {string} tenantId @param {string} catalog @param {string} id @param {Record<string, any>} body */
export function updateRecord(store, tenantId, catalog, id, body) {
  const def = definitionOf(catalog);
  const row = findRow(store, tenantId, catalog, id);
  const merged = { ...row, ...pickWritable(body, def.writable) };
  validate(store, tenantId, catalog, merged);
  Object.assign(row, merged);
  return enrich(store, tenantId, row);
}

/** Logical delete (R-MOCK-7): flags the record inactive, never removes it. */
export function deleteRecord(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {string} */ catalog, /** @type {string} */ id) {
  const def = definitionOf(catalog);
  findRow(store, tenantId, catalog, id)[def.activeKey] = false;
}
