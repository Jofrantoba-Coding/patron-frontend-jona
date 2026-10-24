import { todayIso } from './dates.js';
import { MockError } from './errors.js';
import { checkOps, flagsOf, isActive } from './padronRule.js';
import { ACTIVE_KEY, rowsOf } from './validators.js';

/**
 * The store side of the named rule `padron` (R-ANX-7, R-ANX-8): it checks a composite body against the pure rule (`padronRule.js`) before anything is written and,
 * once the rows are stored, closes the deactivated rows that carry no fecha fin (the desktop sets it to today) and derives the master flags from the active rows.
 * The entry names the rule as `rules: [{ name: 'padron', params: { child, flags } }]`, `flags` mapping a padron id to the master field.
 */

/** @param {any} entry */
const ruleOf = (entry) => (entry.rules ?? []).find((/** @type {any} */ r) => r.name === 'padron');

/** The live rows of one parent in the child section. @param {any} child @param {unknown} parentId */
const ownRows = (child, parentId) => (/** @type {any} */ row) => String(row[child.parentKey]) === String(parentId) && row[ACTIVE_KEY] !== false;

/**
 * After the write: a closed row with no fecha fin gets today, and the master flags become what the active rows say.
 * @param {any} store @param {string} tenantId @param {any} parent @param {any} child @param {Record<string, string>} flags @param {string} parentId
 */
function settle(store, tenantId, parent, child, flags, parentId) {
  const mine = rowsOf(store, tenantId, child).filter(ownRows(child, parentId));
  for (const row of mine) if (!isActive(row) && !row.f_fin) row.f_fin = todayIso();
  const master = rowsOf(store, tenantId, parent).find((/** @type {any} */ r) => r[parent.idKey] === parentId);
  if (master) Object.assign(master, flagsOf(mine, flags));
}

/**
 * The `padron` child rule (`CHILD_RULE_HOOKS`): runs after the field validation and before the write. It refuses a body that activates a padron already active or
 * incompatible with an active one (409 `ACTION_NOT_ALLOWED`, the desktop sentence) and returns what runs after the write. A create always settles, so the flags exist.
 * @param {any} store @param {string} tenantId @param {any} parent @param {Record<string, any[]>} planned
 * @param {{ parentId?: string, creating?: boolean }} [options]
 * @returns {((parentId: string) => void) | undefined}
 */
export function padronChildHook(store, tenantId, parent, planned, { parentId, creating = false } = {}) {
  const rule = ruleOf(parent);
  if (!rule || !(rule.params.child in planned || creating)) return undefined;
  const child = store.registry.bySlug.get(`${parent.slug}/${rule.params.child}`);
  const stored = parentId === undefined ? [] : rowsOf(store, tenantId, child).filter(ownRows(child, parentId));
  const found = checkOps(stored, planned[rule.params.child] ?? [], { child: rule.params.child });
  // The 409 names the refused row (`padrones[n].id_padron`), so the register shows it on that pending row and goes to the tab (S-MD-8).
  if (found) throw new MockError(409, 'ACTION_NOT_ALLOWED', found.conflict, [{ field: `${rule.params.child}[${found.index}].id_padron`, code: 'ACTION_NOT_ALLOWED', message: found.conflict }]);
  return (id) => settle(store, tenantId, parent, child, rule.params.flags, id);
}
