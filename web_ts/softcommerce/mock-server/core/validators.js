import { resolveWhere, scopeFilter, sessionEmpresa } from './context.js';
import { duplicateError, validationError } from './errors.js';
import { isIsoDate, todayIso } from './dates.js';
import { fieldMessage } from './messages.js';
import { normalizeValue } from './normalize.js';
import { DECIMAL_TEXT, outOfBounds } from './numbers.js';
import { ownedFields, ruleDetail } from './entryRules.js';
import { BACKINGS } from '../registry/backings.js';
import { confirmationOf } from './password.js';
import { fieldState, gateOpen, maxLengthOf, minLengthOf } from './predicates.js';
import { findConflict, isActive, isActiveSibling, same } from './unique.js';

/** Logical-delete flag shared by every registry catalog (R-MOCK-7). */
export const ACTIVE_KEY = 'activo';

/**
 * @typedef {{ idKey: string, activeKey?: string, rows: any[], refFilter?: (row: any) => boolean, refMessage?: string }} Target
 * @typedef {{ field: string, code: string, message: string }} Detail
 */

const isBlank = (/** @type {unknown} */ value) => String(value ?? '').trim() === '';

/** Rows of an entry: the tenant dataset, or the global one for `shared` entries. @param {any} store @param {string} tenantId @param {any} entry */
export function rowsOf(store, tenantId, entry) {
  // A backed entry reads the records another part of the store holds (D15): the live ones of the tenant.
  if (entry.backing !== undefined) return BACKINGS[entry.backing].rows(store, tenantId);
  return entry.scope === 'shared' ? store.shared[entry.section] : store.data(tenantId)[entry.section];
}

/**
 * The value a `via` lookup filter matches: what the row of `via.catalog` chosen by `value` holds in `via.key`
 * ('' when there is no such row or it holds none). The chosen row is found without the session scope: it is only read for its key.
 * @param {any} store @param {string} tenantId @param {{ catalog: string, key: string }} via @param {unknown} value
 */
export function viaValue(store, tenantId, via, value) {
  const source = store.registry.bySlug.get(via.catalog);
  const chosen = rowsOf(store, tenantId, source).find((/** @type {any} */ r) => same(r[source.idKey], value));
  return String(chosen?.[via.key] ?? '');
}

/**
 * Whether `row` of an entry passes an `exists` lookup filter (R-MOCK-16): some active row of `filter.catalog` holds the id of `row` in
 * `filter.local`, the filter `value` in `filter.key` (the filter key itself unless renamed) and every static `filter.where` value
 * (tipos-doc-venta with an active correlativo in a punto de venta).
 * @param {any} store @param {string} tenantId @param {{ catalog: string, local: string, key?: string, where?: Record<string, unknown> }} filter
 * @param {string} key the filter key the caller sent @param {unknown} value @param {any} row @param {string} idKey @param {import('./context.js').RequestContext} [ctx]
 */
export function existsRow(store, tenantId, filter, key, value, row, idKey, ctx) {
  const target = store.registry.bySlug.get(filter.catalog);
  const inScope = scopeFilter(store, tenantId, target, ctx);
  return rowsOf(store, tenantId, target).some(
    (/** @type {any} */ r) =>
      r[ACTIVE_KEY] !== false && inScope(r) && same(r[filter.local], row[idKey]) && same(r[filter.key ?? key], value) &&
      Object.entries(filter.where ?? {}).every(([field, expected]) => String(r[field]) === String(expected)),
  );
}

/**
 * What a ref or join points to: a registry catalog or a W1 builtin source. An
 * `empresa`-scope catalog shows only the session empresa rows, unless `scoped` is false (a join only reads the name of the
 * row a record already points to, so a tenant-wide list still names the familia of another empresa).
 * @param {any} store @param {string} tenantId @param {string} catalog @param {import('./context.js').RequestContext} [ctx] @param {boolean} [scoped] @returns {Target}
 */
export function targetOf(store, tenantId, catalog, ctx, scoped = true) {
  const { sources, bySlug } = store.registry;
  if (Object.hasOwn(sources, catalog)) {
    const { idKey, rows, refFilter, refMessage } = sources[catalog];
    return { idKey, rows: rows(store, tenantId), refFilter, refMessage };
  }
  const entry = bySlug.get(catalog);
  return { idKey: entry.idKey, activeKey: ACTIVE_KEY, rows: scoped ? rowsOf(store, tenantId, entry).filter(scopeFilter(store, tenantId, entry, ctx)) : rowsOf(store, tenantId, entry) };
}

/**
 * The columns `derive` copies from a referenced row (`fromRef`, the Usuario nombre from its trabajador): the value `key` of the row `field` points to, or ''.
 * Server-owned: a body never writes them, and every write recomputes them.
 * @param {any} store @param {string} tenantId @param {any} entry @param {Record<string, any>} record @param {import('./context.js').RequestContext} [ctx]
 */
export function refDerived(store, tenantId, entry, record, ctx) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const { target, fromRef } of (entry.derive ?? []).filter((/** @type {any} */ d) => d.fromRef)) {
    const ref = entry.refs.find((/** @type {any} */ r) => r.field === fromRef.field);
    const source = targetOf(store, tenantId, ref.catalog, ctx);
    const row = source.rows.find((/** @type {any} */ r) => String(r[source.idKey]) === String(record[fromRef.field] ?? ''));
    out[target] = String(row?.[fromRef.key] ?? '');
  }
  return out;
}

/**
 * The writable part of a body (R-MOCK-9): only declared non-code fields, strings
 * trimmed and normalized (D15). `compat` entries keep the raw W1 values. A field whose company-parameter gate is off is absent: its body value is ignored (R-REG-17).
 * @param {any} entry @param {Record<string, any>} body @param {Record<string, unknown>} [params] the tenant company params; without them no gate is applied
 */
export function pickWritable(entry, body, params) {
  /** @type {Record<string, any>} */
  const record = {};
  const owned = ownedFields(entry);
  for (const f of entry.fields) {
    // A password travels untrimmed with its confirmation (R-CRUD-17); the store keeps only its hash (D16).
    if (f.kind === 'password') {
      for (const key of [f.name, confirmationOf(f.name)]) if (key in body) record[key] = String(body[key] ?? '');
      continue;
    }
    // A code is the server's, a transient select is a form-only level (the ubigeo cascade) and a field a named rule owns is derived by it: none is written.
    if (f.kind === 'code' || f.transient || owned.includes(f.name) || !(f.name in body) || (params !== undefined && !gateOpen(f.gate, params))) continue;
    record[f.name] = entry.compat ? body[f.name] : normalizeValue(body[f.name], f.normalize);
  }
  return record;
}

/** A number outside the inclusive `range` of its field (R-MOCK-10); a blank or non-numeric value is another step's business. @returns {Detail|null} */
function rangeDetail(/** @type {any} */ entry, /** @type {any} */ f, /** @type {Record<string, any>} */ record, /** @type {keyof typeof import('./messages.js').MODO} */ mode) {
  const text = String(record[f.name] ?? '').trim();
  if (!f.range || !/^\d+$/.test(text)) return null;
  const n = Number(text);
  const { min = -Infinity, max = Infinity } = f.range;
  return n < min || n > max ? { field: f.name, code: 'RANGE', message: fieldMessage(entry, f, 'RANGE', mode) } : null;
}

/**
 * A password (R-CRUD-17): required on a create, a blank one on UPDATE keeps the stored value; at most `max` characters; the confirmation must equal it
 * (422 on `<name>_confirmacion`). No message names the value.
 * @returns {Detail|null}
 */
function passwordDetail(/** @type {any} */ entry, /** @type {any} */ f, /** @type {Record<string, any>} */ record, /** @type {keyof typeof import('./messages.js').MODO} */ mode) {
  const value = String(record[f.name] ?? '');
  const confirmation = String(record[confirmationOf(f.name)] ?? '');
  const mismatch = { field: confirmationOf(f.name), code: 'MISMATCH', message: fieldMessage(entry, f, 'MISMATCH', mode) };
  if (value === '') {
    if (mode !== 'UPDATE') return { field: f.name, code: 'REQUIRED', message: fieldMessage(entry, f, 'REQUIRED', mode) };
    return f.confirm && confirmation !== '' ? mismatch : null;
  }
  if (value.length > f.max) return { field: f.name, code: 'MAX_LENGTH', message: fieldMessage(entry, f, 'MAX_LENGTH', mode) };
  return f.confirm && confirmation !== value ? mismatch : null;
}

/** Required, length, option, number and boolean checks of one field. A `skipRange` field leaves its range to a `{range}` step. @returns {Detail|null} */
function fieldDetail(/** @type {any} */ entry, /** @type {any} */ f, /** @type {Record<string, any>} */ record, /** @type {keyof typeof import('./messages.js').MODO} */ mode, skipRange = false) {
  // A hidden or disabled field is not validated (R-CRUD-5); `requiredWhen` makes a visible one required (R-CRUD-13).
  const state = fieldState(f, record);
  if (!state.visible || !state.enabled) return null;
  if (f.kind === 'password') return passwordDetail(entry, f, record, mode);
  const value = record[f.name];
  // `maxWhen` (R-REG-2): the limit may depend on another field; the message names the limit that applied.
  const limit = maxLengthOf(f, record);
  const bad = (/** @type {'REQUIRED'|'MAX_LENGTH'|'MIN_LENGTH'|'INVALID'|'DATE'|'NOT_FUTURE'|'MIN_DATE'|'AFTER_FIELD'} */ code) => ({ field: f.name, code, message: fieldMessage(entry, { ...f, max: limit }, code, mode) });
  if (isBlank(value)) {
    const optional = (entry.compat?.serverOptional ?? []).includes(f.name);
    return state.required && !optional ? bad('REQUIRED') : null;
  }
  const text = String(value);
  if ((f.kind === 'text' || f.kind === 'textarea' || f.kind === 'code') && limit !== undefined && text.length > limit) {
    return bad('MAX_LENGTH');
  }
  // `minLen` / `minLenWhen` (R-REG-4): a value shorter than the length that applies is judged like a missing one.
  if (f.kind === 'text' && text.length < (minLengthOf(f, record) ?? 0)) return bad('MIN_LENGTH');
  if (f.kind === 'options' && !f.options.some((/** @type {any} */ o) => o.value === text)) {
    return bad('INVALID');
  }
  if (f.kind === 'number' && !(f.scale === 0 ? /^\d+$/ : DECIMAL_TEXT).test(text)) {
    return bad('INVALID');
  }
  // At scale 0 `max` counts digits (R-CRUD-11).
  if (f.kind === 'number' && f.scale === 0 && f.max !== undefined && text.length > f.max) return bad('MAX_LENGTH');
  // `min` and `exclusiveMin` speak with the wording of the field (the desktop says "especificar" for a zero amount).
  if (f.kind === 'number' && outOfBounds(f, text)) return { field: f.name, code: 'RANGE', message: fieldMessage(entry, f, 'RANGE', mode) };
  if (f.kind === 'number' && !skipRange) return rangeDetail(entry, f, record, mode);
  if (f.kind === 'boolean' && typeof value !== 'boolean') return bad('INVALID');
  if (f.kind === 'date') return dateDetail(f, text, record, bad);
  return null;
}

/**
 * A date must be a real ISO day; then the optional rules (S-CRUD-28): `notFuture` (today is accepted), `min` (inclusive)
 * and `afterField` (equal dates accepted; nothing to compare while the other date is blank or invalid).
 * @param {any} f @param {string} text @param {Record<string, any>} record @param {(code: 'DATE'|'NOT_FUTURE'|'MIN_DATE'|'AFTER_FIELD') => Detail} bad @returns {Detail|null}
 */
function dateDetail(f, text, record, bad) {
  if (!isIsoDate(text)) return bad('DATE');
  if (f.notFuture && text > todayIso()) return bad('NOT_FUTURE');
  if (f.min !== undefined && text < f.min) return bad('MIN_DATE');
  const other = f.afterField === undefined ? undefined : record[f.afterField];
  if (isIsoDate(other) && text < other) return bad('AFTER_FIELD');
  return null;
}

/** A ref must exist, be active, match the static `where` and belong to its parents. @returns {Detail|null} */
function refDetail(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {any} */ ref, /** @type {Record<string, any>} */ record, /** @type {any} */ ctx) {
  const value = String(record[ref.field] ?? '').trim();
  if (value === '') return null;
  const target = targetOf(store, tenantId, ref.catalog, ctx);
  const missing = { field: ref.field, code: 'REF_NOT_FOUND', message: `${ref.field} ${target.refMessage ?? 'does not exist'}` };
  const row = target.rows.find((/** @type {any} */ r) => String(r[target.idKey]) === value && (target.refFilter?.(r) ?? true));
  if (!row) return missing;
  if (ref.activeOnly && target.activeKey && row[target.activeKey] === false) return missing;
  if (Object.entries(resolveWhere(store, tenantId, ref.where, ctx)).some(([key, expected]) => String(row[key]) !== String(expected))) return missing;
  const targetEntry = store.registry.bySlug.get(ref.catalog);
  const lookupFilters = targetEntry?.lookupFilters ?? {};
  /**
   * A parent is matched on the filter key, through its `via` when the target declares one (the SUNAT code of a familia), or through its
   * `exists` rule: the row belongs when an active row of the other catalog links it to the parent value (the tipo of a punto de venta).
   */
  const belongs = (/** @type {any} */ p) => {
    const { via, exists } = lookupFilters[p.filterKey] ?? {};
    if (exists) return existsRow(store, tenantId, exists, p.filterKey, record[p.field], row, targetEntry.idKey, ctx);
    if (!via) return same(row[p.filterKey], record[p.field]);
    const held = viaValue(store, tenantId, via, record[p.field]);
    return held !== '' && same(row[via.as], held);
  };
  const parent = ref.parents.find((/** @type {any} */ p) => !belongs(p));
  return parent ? { ...missing, message: `${ref.field} does not belong to ${parent.field}` } : null;
}

/**
 * A unique key over the active rows (S-REG-9, S-REG-10). A child key is scoped by its parent and only counts ACTIVE siblings, so a deactivated
 * (`estado` `D`) or deleted row never conflicts (R-MD-6); `siblings` replaces the stored rows with the working view of a composite write.
 * @returns {Detail|null}
 */
function uniqueDetail(/** @type {any} */ store, /** @type {string} */ tenantId, /** @type {any} */ entry, /** @type {any} */ key, /** @type {Record<string, any>} */ record, /** @type {string|undefined} */ selfId, /** @type {any} */ ctx, /** @type {string|undefined} */ parentId, /** @type {any[]|undefined} */ siblings) {
  // The session empresa is part of the key only with `includeEmpresa` (R-REG-7).
  const empresa = key.includeEmpresa ? sessionEmpresa(store, tenantId, ctx) : undefined;
  const pool = siblings ?? rowsOf(store, tenantId, entry).filter(
    (/** @type {any} */ r) => (entry.parentKey === undefined || String(r[entry.parentKey]) === String(parentId)) && (empresa === undefined || String(r.id_empresa) === empresa),
  );
  const taken = findConflict(pool, key.fields, record, { selfId, idKey: entry.idKey, active: entry.parentKey === undefined ? isActive : isActiveSibling });
  return taken ? { field: key.errorField, code: 'DUPLICATE', message: key.message } : null;
}

/**
 * Runs the entry `steps` in their declared order (D10). A W2 entry stops at the
 * first failing step, like the desktop: one detail, 409 for a unique key and 422
 * for anything else. A `compat` entry (Localidad) keeps the W1 behavior: every
 * field and ref failure in one 422, uniqueness checked afterwards. `{rule}` steps
 * run the named rule's validate hook.
 * @param {any} store @param {string} tenantId @param {any} entry @param {Record<string, any>} record
 * @param {{ selfId?: string, ctx?: import('./context.js').RequestContext, mode?: keyof typeof import('./messages.js').MODO, parentId?: string, siblings?: any[] }} [options]
 * `mode` words the messages: INSERT on create, UPDATE on update. `parentId` scopes a child's unique key to the rows of its parent; `siblings` is the
 * working view of those rows during a composite write (stored rows plus the ops planned before this one).
 */
export function validateRecord(store, tenantId, entry, record, { selfId, ctx, mode = 'INSERT', parentId, siblings } = {}) {
  const failed = new Set();
  const params = store.data(tenantId).params;
  const fields = new Map(entry.fields.map((/** @type {any} */ f) => [f.name, f]));
  const inlineRefs = !entry.steps.some((/** @type {any} */ s) => typeof s === 'object' && 'ref' in s);
  const isUnique = (/** @type {any} */ step) => typeof step === 'object' && 'unique' in step;
  // A `{range: name}` step takes that field's range check out of the field step (R-REF-7 Turno order).
  const ranged = new Set(entry.steps.flatMap((/** @type {any} */ s) => (typeof s === 'object' && 'range' in s ? [s.range] : [])));
  /** The failure of a field or ref step, if any. @param {any} step @returns {Detail|null} */
  const stepDetail = (step) => {
    const name = typeof step === 'string' ? step : step.ref;
    // The client validates a transient level; the server never sees it.
    if (typeof step === 'string' && fields.get(name).transient) return null;
    // A field whose company-parameter gate is off is neither required nor validated (R-REG-17).
    if (!gateOpen(fields.get(name).gate, params)) return null;
    let detail = typeof step === 'string' ? fieldDetail(entry, fields.get(name), record, mode, ranged.has(name)) : null;
    if (!detail && !failed.has(name) && (typeof step === 'object' ? 'ref' in step : inlineRefs && ['select', 'lookup'].includes(fields.get(name).kind))) {
      detail = refDetail(store, tenantId, entry.refs.find((/** @type {any} */ r) => r.field === name), record, ctx);
    }
    if (detail) failed.add(name);
    return detail;
  };
  /** @param {any} step */
  const uniqueOf = (step) => uniqueDetail(store, tenantId, entry, entry.unique[step.unique], record, selfId, ctx, parentId, siblings);

  /** @type {Detail[]} */
  const details = [];
  for (const step of entry.steps) {
    if (isUnique(step)) {
      const duplicate = entry.compat ? null : uniqueOf(step);
      if (duplicate) throw duplicateError([duplicate]);
      continue;
    }
    // A named rule is shared code: the same hook runs on the form (D10).
    const detail = typeof step === 'object' && 'rule' in step ? ruleDetail(entry, step.rule, record, mode) : typeof step === 'object' && 'range' in step ? rangeDetail(entry, fields.get(step.range), record, mode) : stepDetail(step);
    if (detail && !entry.compat) throw validationError([detail]);
    if (detail) details.push(detail);
  }
  if (details.length > 0) throw validationError(details);
  for (const step of entry.compat ? entry.steps.filter(isUnique) : []) {
    const detail = uniqueOf(step);
    if (detail) throw duplicateError([detail]);
  }
}

/**
 * Index of the first server-only step (`{unique}` or `{ref}`), or `steps.length`
 * when none: the client validates the steps before it and leaves the rest to the
 * server (S-REG-17). Named `{rule}` steps are shared code, so the client runs them.
 * @param {any} entry
 */
export function firstServerOnlyStep(entry) {
  const index = entry.steps.findIndex((/** @type {any} */ s) => typeof s === 'object' && ('unique' in s || 'ref' in s));
  return index === -1 ? entry.steps.length : index;
}

/**
 * Parses a positive integer query value, falling back when invalid.
 * @param {unknown} raw @param {number} fallback @param {number} [max]
 */
export function positiveInt(raw, fallback, max = Number.MAX_SAFE_INTEGER) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, max) : fallback;
}
