import { childrenOf } from './ubigeo.js';
import { ACTIVE_KEY, rowsOf } from './validators.js';

/** Catalogs the `has` parameter of `ubigeoHasActive` may name: each stores the distrito it sits in as `id_ubigeo`. */
const HAS = ['zonas'];

/**
 * The ubigeo ids held by the active rows of a catalog in a tenant (a logically deleted row never counts).
 * @param {any} store @param {string} tenantId @param {string} slug
 */
const heldIds = (store, tenantId, slug) =>
  rowsOf(store, tenantId, store.registry.bySlug.get(slug))
    .filter((/** @type {any} */ row) => row[ACTIVE_KEY] !== false)
    .map((/** @type {any} */ row) => String(row.id_ubigeo ?? ''));

/**
 * Named lookup-filter rules (D9): each answers `lookups/<slug>` for a source that is not a plain table.
 * `keys` are the query parameters it accepts; `options` returns the `{id,name}` items (it also gets the tenant).
 * @type {Record<string, { keys: string[], options: (store: any, filters: Record<string, string>, tenantId: string) => { id: string, name: string }[] }>}
 */
export const LOOKUP_RULES = {
  // The child level comes from the length of `parent`; none asks for the departamentos (S-MOCK-8).
  ubigeoChildren: { keys: ['parent'], options: (store, { parent }) => childrenOf(store, parent).items },
  // The same children, kept only when an active row of the catalog named by `has` sits at or below them (S-MOCK-31). INEI codes nest by
  // prefix, so a departamento holds a zona when some zona code starts with it. A blank `has` filters nothing; an unnamed catalog gives none.
  ubigeoHasActive: {
    keys: ['parent', 'has'],
    options: (store, { parent, has }, tenantId) => {
      const children = childrenOf(store, parent).items;
      if (has === undefined || has === '') return children;
      if (!HAS.includes(has)) return [];
      const held = heldIds(store, tenantId, has);
      return children.filter((child) => held.some((/** @type {string} */ id) => id.startsWith(child.id)));
    },
  },
};

// The named entry rules (D9): hooks and runners live in `entryRules.js` so the validators can import them without a cycle.
export { docIdentidad } from './docIdentidad.js';
export { ENTRY_RULE_HOOKS, ENTRY_RULE_NAMES, ruleDerived, ruleDetail, ruleEffects, ruleStates } from './entryRules.js';
