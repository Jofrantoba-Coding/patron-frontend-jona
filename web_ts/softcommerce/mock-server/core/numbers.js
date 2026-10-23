/**
 * Decimal rules shared by the server validators and the UI (R-CRUD-11, R-MOCK-10), so both judge the same text.
 */

/** A complete decimal as written: the input pattern `-?[0-9]*(\.[0-9]*)?` (R-CRUD-11) with digits on both sides of the point. */
export const DECIMAL_TEXT = /^-?\d+(\.\d+)?$/;

/** Significant digits an IEEE double keeps exactly: past them the wire number would round the typed value. */
const EXACT_DIGITS = 15;

/** True when the decimal fits a wire number without losing a digit. @param {string} text a complete decimal */
export function isExactDecimal(text) {
  return text.replace(/^-/, '').replace('.', '').replace(/^0+/, '').length <= EXACT_DIGITS;
}

/**
 * A number below its `min` or not above its `exclusiveMin` (S-CRUD-25: `-3` is typed, then rejected by a `> 0` rule).
 * @param {{ min?: number, exclusiveMin?: number }} field @param {string} text a complete decimal
 */
export function outOfBounds(field, text) {
  const n = Number(text);
  return (field.min !== undefined && n < field.min) || (field.exclusiveMin !== undefined && n <= field.exclusiveMin);
}
