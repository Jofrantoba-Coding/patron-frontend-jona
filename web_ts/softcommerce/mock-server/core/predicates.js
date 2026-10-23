/**
 * The one condition evaluator behind `visibleWhen`, `enabledWhen` and `requiredWhen`
 * (`{ field, in: [...] }`). Pure: the UI and both mocks import this same module.
 * @typedef {{ field: string, in: string[] }} Cond
 */

/** `null` and a missing field read as the empty string; other values by their text. @param {unknown} value */
const text = (value) => String(value ?? '');

/**
 * Whether a condition holds for the form values; no condition always holds.
 * @param {Cond|undefined} cond @param {Record<string, unknown>} values
 */
export function matches(cond, values) {
  return cond === undefined || cond.in.map(text).includes(text(values[cond.field]));
}

/**
 * Visible, enabled and required state of a field. A hidden field is not enabled
 * and a disabled field is not required, so neither is validated (R-CRUD-5).
 * @param {{ name?: string, required?: boolean, visibleWhen?: Cond, enabledWhen?: Cond, requiredWhen?: Cond, ruleState?: (values: any) => { hidden?: boolean, disabled?: boolean, required?: boolean } | undefined }} field
 * @param {Record<string, unknown>} values
 */
export function fieldState(field, values) {
  // A named rule (`docIdentidad`) may hide, disable or require the field on top of its own conditions (D9): `ruleState` is attached by the registry.
  const overlay = field.ruleState?.(values) ?? {};
  const visible = matches(field.visibleWhen, values) && overlay.hidden !== true;
  const enabled = visible && matches(field.enabledWhen, values) && overlay.disabled !== true;
  const required = enabled && (field.required === true || overlay.required === true || (field.requiredWhen !== undefined && matches(field.requiredWhen, values)));
  return { visible, enabled, required };
}

/**
 * The minimum length a text field must have for `values` (R-REG-4): its plain `minLen`, or the `len` of the first
 * `minLenWhen` rule whose condition holds. `undefined` when no length applies.
 * @param {{ minLen?: number, minLenWhen?: { when: Cond, len: number }[] }} field
 * @param {Record<string, unknown>} values
 */
export function minLengthOf(field, values) {
  return field.minLen ?? field.minLenWhen?.find((rule) => matches(rule.when, values))?.len;
}

/**
 * The maximum length a text field takes for `values` (R-REG-2): the `len` of the first `maxWhen` rule whose condition holds, else its plain
 * `max` (the UI config calls it `maxLength`). `undefined` when no limit applies.
 * @param {{ max?: number, maxLength?: number, maxWhen?: { when: Cond, len: number }[] }} field
 * @param {Record<string, unknown>} values
 */
export function maxLengthOf(field, values) {
  return field.maxWhen?.find((rule) => matches(rule.when, values))?.len ?? field.max ?? field.maxLength;
}
