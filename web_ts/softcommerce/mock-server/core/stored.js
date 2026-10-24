import { isModeMap } from '../registry/schema.js';
import { todayIso } from './dates.js';
import { ruleDerived } from './entryRules.js';
import { fieldState, matches, resolveParamToken } from './predicates.js';

/**
 * Stored-only columns and conditional storage of a record (R-CRUD-13, R-REF-8, R-REF-9). Pure: both mocks go through it.
 */

/** A hidden conditional field (`visibleWhen` fails, or a named rule hides it) is stored as an empty string, whether the UI sent `null` or a value. @param {any} entry @param {Record<string, any>} record */
export function blankHidden(entry, record) {
  for (const f of entry.fields) if (!fieldState(f, record).visible) record[f.name] = '';
  return record;
}

/** The columns `derive` computes from the record: `then` when its condition holds, `else` otherwise. @param {any} entry @param {Record<string, any>} record */
export function derivedValues(entry, record) {
  return Object.fromEntries((entry.derive ?? []).filter((/** @type {any} */ d) => d.fromRef === undefined).map((/** @type {any} */ d) => [d.target, matches(d.when, record) ? d.then : d.else]));
}

/** The record plus what the named entry rules compute from it: the composed razon social, the persona flag (D9). @param {any} entry @param {Record<string, any>} record */
export function withRuleDerived(entry, record) {
  return { ...record, ...ruleDerived(entry, record) };
}

/**
 * Declared defaults for the fields a create body leaves out: a scalar `default`, or the
 * INSERT entry of a per-mode map (R-CRUD-15). A date default `today` is the server day; a decimal default is
 * stored as the number it spells. A `$params.X` default is the company parameter `X` (D27b); a missing parameter leaves the field out.
 * Updates never re-apply them.
 * @param {any} entry @param {Record<string, any>} record @param {Record<string, unknown>} [params] the tenant company params
 */
export function withDefaults(entry, record, params) {
  const out = { ...record };
  for (const f of entry.fields) {
    if (f.name in out || f.default === undefined) continue;
    const value = resolveParamToken(isModeMap(f.default) ? f.default.INSERT : f.default, params);
    if (value !== undefined) out[f.name] = f.kind === 'date' && value === 'today' ? todayIso() : f.kind === 'number' && typeof value === 'string' ? Number(value) : value;
  }
  return out;
}
