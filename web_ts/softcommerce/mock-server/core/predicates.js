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

/**
 * Whether a company-parameter gate is open (R-REG-17): no gate always is; `{ param }` needs the parameter true; `{ param, in }` needs its value to equal
 * one of the listed values (compared by text). Pure: the server reads the tenant params, the UI the session params.
 * @param {{ param: string, in?: unknown[] } | undefined} gate @param {Record<string, unknown> | undefined} params
 */
export function gateOpen(gate, params) {
  if (gate === undefined) return true;
  const value = params?.[gate.param];
  return gate.in === undefined ? value === true : gate.in.map(text).includes(text(value));
}

const PARAMS_TOKEN = /^\$params\.(\w+)$/;

/** The params key named by a `$params.X` value token (D27b), or undefined when the value is not a token. @param {unknown} value */
export const paramToken = (value) => (typeof value === 'string' ? PARAMS_TOKEN.exec(value)?.[1] : undefined);

/** A `$params.X` token resolved against the company params (undefined when the key is absent); any other value is returned as is. @param {unknown} value @param {Record<string, unknown> | undefined} params */
export function resolveParamToken(value, params) {
  const key = paramToken(value);
  return key === undefined ? value : params?.[key];
}
