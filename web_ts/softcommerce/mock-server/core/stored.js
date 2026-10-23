import { ruleDerived } from './entryRules.js';
import { fieldState, matches } from './predicates.js';

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
  return Object.fromEntries((entry.derive ?? []).map((/** @type {any} */ d) => [d.target, matches(d.when, record) ? d.then : d.else]));
}

/** The record plus what the named entry rules compute from it: the composed razon social, the persona flag (D9). @param {any} entry @param {Record<string, any>} record */
export function withRuleDerived(entry, record) {
  return { ...record, ...ruleDerived(entry, record) };
}
