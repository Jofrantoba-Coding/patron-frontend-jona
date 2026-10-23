import { childrenOf } from './ubigeo.js';

/**
 * Named lookup-filter rules (D9): each answers `lookups/<slug>` for a source that is not a plain table.
 * `keys` are the query parameters it accepts; `options` returns the `{id,name}` items.
 * @type {Record<string, { keys: string[], options: (store: any, filters: Record<string, string>) => { id: string, name: string }[] }>}
 */
export const LOOKUP_RULES = {
  // The child level comes from the length of `parent`; none asks for the departamentos (S-MOCK-8).
  ubigeoChildren: { keys: ['parent'], options: (store, { parent }) => childrenOf(store, parent).items },
};
