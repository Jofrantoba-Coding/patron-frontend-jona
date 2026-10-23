import { docIdentidad } from './docIdentidad.js';

/**
 * The closed set of named entry rules (D9) and how an entry runs them. Each rule is up to four pure hooks (`state`, `validate`, `effect`,
 * `derive`); an entry lists `rules: [{ name, params? }]` and a `{ rule: name }` step in its `validation`. The UI and both mocks go through
 * these helpers, so the three apply the same rule. Kept apart from `rules.js` (lookup filters), which reads the store.
 */
export const ENTRY_RULE_HOOKS = { docIdentidad };
export const ENTRY_RULE_NAMES = Object.keys(ENTRY_RULE_HOOKS);

/** The `{ name, params }` pairs of an entry. @param {any} entry @returns {{ hooks: any, params: any, name: string }[]} */
const rulesOf = (entry) => (entry?.rules ?? []).map((/** @type {any} */ r) => ({ name: r.name, params: r.params, hooks: /** @type {any} */ (ENTRY_RULE_HOOKS)[r.name] }));

/** The per-field `{ hidden, disabled, required, max }` every rule of the entry declares for `values`, by field name. @param {any} entry @param {Record<string, unknown>} values */
export function ruleStates(entry, values) {
  return Object.assign({}, ...rulesOf(entry).map(({ hooks, params }) => hooks.state?.(values, params) ?? {}));
}

/**
 * The failure of the named rule's `validate` hook, if any (a rule step stops at the first failing check).
 * @param {any} entry @param {string} name @param {Record<string, unknown>} values @param {string} [mode]
 * @returns {{ field: string, code: string, message: string } | null}
 */
export function ruleDetail(entry, name, values, mode) {
  const rule = rulesOf(entry).find((r) => r.name === name);
  return rule?.hooks.validate?.(values, rule.params, { entry, mode })[0] ?? null;
}

/**
 * What one edit of `changed` triggers across the entry rules: the patches merged and the first alert.
 * @param {any} entry @param {Record<string, unknown>} values @param {string} changed
 * @returns {{ patch: Record<string, string>, alert?: string }}
 */
export function ruleEffects(entry, values, changed) {
  const results = rulesOf(entry).map(({ hooks, params }) => hooks.effect?.(values, changed, params) ?? {});
  return { patch: Object.assign({}, ...results.map((r) => r.patch)), alert: results.find((r) => r.alert)?.alert };
}

/** The values the entry rules compute from `values` (the composed razon social, the persona flag). @param {any} entry @param {Record<string, unknown>} values @returns {Record<string, string>} */
export function ruleDerived(entry, values) {
  return Object.assign({}, ...rulesOf(entry).map(({ hooks, params }) => hooks.derive?.(values, params) ?? {}));
}
