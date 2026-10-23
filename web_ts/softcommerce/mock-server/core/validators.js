import { duplicateError, validationError } from './errors.js';

/** Logical-delete flag shared by every registry catalog (R-MOCK-7). */
export const ACTIVE_KEY = 'activo';

/**
 * @typedef {{ idKey: string, activeKey?: string, rows: any[], refFilter?: (row: any) => boolean, refMessage?: string }} Target
 * @typedef {{ field: string, code: string, message: string }} Detail
 */

const isBlank = (/** @type {unknown} */ value) => String(value ?? '').trim() === '';
const same = (/** @type {unknown} */ a, /** @type {unknown} */ b) => String(a ?? '').trim() === String(b ?? '').trim();

/** Rows of an entry: the tenant dataset, or the global one for `shared` entries. @param {any} store @param {string} tenantId @param {any} entry */
export function rowsOf(store, tenantId, entry) {
  return entry.scope === 'shared' ? store.shared[entry.section] : store.data(tenantId)[entry.section];
}

/**
 * What a ref or join points to: a registry catalog or a W1 builtin source.
 * @param {any} store @param {string} tenantId @param {string} catalog @returns {Target}
 */
export function targetOf(store, tenantId, catalog) {
  const { sources, bySlug } = store.registry;
  if (Object.hasOwn(sources, catalog)) {
    const { idKey, rows, refFilter, refMessage } = sources[catalog];
    return { idKey, rows: rows(store, tenantId), refFilter, refMessage };
  }
  const entry = bySlug.get(catalog);
  return { idKey: entry.idKey, activeKey: ACTIVE_KEY, rows: rowsOf(store, tenantId, entry) };
}

/**
 * The writable part of a body (R-MOCK-9): only declared non-code fields, strings
 * trimmed. `compat` entries keep the raw W1 values.
 * @param {any} entry @param {Record<string, any>} body
 */
export function pickWritable(entry, body) {
  /** @type {Record<string, any>} */
  const record = {};
  for (const f of entry.fields) {
    if (f.kind === 'code' || !(f.name in body)) continue;
    record[f.name] = !entry.compat && typeof body[f.name] === 'string' ? body[f.name].trim() : body[f.name];
  }
  return record;
}

/** Required, length, option, number and boolean checks of one field. @returns {Detail|null} */
function fieldDetail(/** @type {any} */ entry, /** @type {any} */ f, /** @type {Record<string, any>} */ record) {
  const value = record[f.name];
  const bad = (/** @type {string} */ code, /** @type {string} */ message) => ({ field: f.name, code, message });
  if (isBlank(value)) {
    const optional = (entry.compat?.serverOptional ?? []).includes(f.name);
    return f.required && !optional ? bad('REQUIRED', `${f.name} is required`) : null;
  }
  const text = String(value);
  if ((f.kind === 'text' || f.kind === 'code') && f.max !== undefined && text.length > f.max) {
    return bad('MAX_LENGTH', `${f.name} must be at most ${f.max} characters`);
  }
  if (f.kind === 'options' && !f.options.some((/** @type {any} */ o) => o.value === text)) {
    return bad('INVALID', `${f.name} must be one of: ${f.options.map((/** @type {any} */ o) => o.value).join(', ')}`);
  }
  if (f.kind === 'number' && !(f.scale === 0 ? /^\d+$/ : /^-?\d+(\.\d+)?$/).test(text)) {
    return bad('INVALID', `${f.name} must be ${f.scale === 0 ? 'an integer' : 'a number'}`);
  }
  if (f.kind === 'boolean' && typeof value !== 'boolean') return bad('INVALID', `${f.name} must be a boolean`);
  return null;
}

/** A ref must exist, be active, match the static `where` and belong to its parents. @returns {Detail|null} */
function refDetail(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {any} */ ref, /** @type {Record<string, any>} */ record) {
  const value = String(record[ref.field] ?? '').trim();
  if (value === '') return null;
  const target = targetOf(store, tenantId, ref.catalog);
  const missing = { field: ref.field, code: 'REF_NOT_FOUND', message: `${ref.field} ${target.refMessage ?? 'does not exist'}` };
  const row = target.rows.find((/** @type {any} */ r) => String(r[target.idKey]) === value && (target.refFilter?.(r) ?? true));
  if (!row) return missing;
  if (ref.activeOnly && target.activeKey && row[target.activeKey] === false) return missing;
  if (Object.entries(ref.where).some(([key, expected]) => String(row[key]) !== String(expected))) return missing;
  const parent = ref.parents.find((/** @type {any} */ p) => String(row[p.filterKey] ?? '') !== String(record[p.field] ?? '').trim());
  return parent ? { ...missing, message: `${ref.field} does not belong to ${parent.field}` } : null;
}

/** @returns {Detail|null} */
function uniqueDetail(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {any} */ entry, /** @type {any} */ key, /** @type {Record<string, any>} */ record, /** @type {string|undefined} */ selfId) {
  // Deleted rows and the record itself never conflict (S-REG-9, S-REG-10).
  const taken = rowsOf(store, tenantId, entry).some(
    (/** @type {any} */ r) =>
      r[ACTIVE_KEY] !== false && String(r[entry.idKey]) !== selfId && key.fields.every((/** @type {string} */ f) => same(r[f], record[f])),
  );
  return taken ? { field: key.errorField, code: 'DUPLICATE', message: key.message } : null;
}

/**
 * Runs the entry `steps` (D10). Field and ref failures are collected into one 422
 * in step order; a unique violation is checked afterwards and answers 409.
 * @param {any} store @param {string} tenantId @param {any} entry @param {Record<string, any>} record @param {string} [selfId]
 */
export function validateRecord(store, tenantId, entry, record, selfId) {
  /** @type {Detail[]} */
  const details = [];
  const failed = new Set();
  const fields = new Map(entry.fields.map((/** @type {any} */ f) => [f.name, f]));
  const inlineRefs = !entry.steps.some((/** @type {any} */ s) => typeof s === 'object' && 'ref' in s);
  /** @param {string} name */
  const checkRef = (name) => {
    const detail = failed.has(name) ? null : refDetail(store, tenantId, entry.refs.find((/** @type {any} */ r) => r.field === name), record);
    if (detail) { details.push(detail); failed.add(name); }
  };
  for (const step of entry.steps) {
    if (typeof step === 'string') {
      const detail = fieldDetail(entry, fields.get(step), record);
      if (detail) { details.push(detail); failed.add(step); } else if (inlineRefs && fields.get(step).kind === 'select') checkRef(step);
    } else if ('ref' in step) checkRef(step.ref);
  }
  if (details.length > 0) throw validationError(details);
  for (const step of entry.steps) {
    if (typeof step === 'string' || !('unique' in step)) continue;
    const detail = uniqueDetail(store, tenantId, entry, entry.unique[step.unique], record, selfId);
    if (detail) throw duplicateError([detail]);
  }
}

/**
 * Parses a positive integer query value, falling back when invalid.
 * @param {unknown} raw @param {number} fallback @param {number} [max]
 */
export function positiveInt(raw, fallback, max = Number.MAX_SAFE_INTEGER) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, max) : fallback;
}
