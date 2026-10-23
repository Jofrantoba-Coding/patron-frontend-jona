/**
 * Lookup sources that are not registry catalogs: the W1 data a `select` field can
 * point to. Each exposes its rows, the key field and how a ref is checked.
 * @typedef {{ idKey: string, rows: (store: any, tenantId: string) => any[], refFilter?: (row: any) => boolean, refMessage?: string, lookupRule?: string, lookupRuleBy?: Record<string, string> }} BuiltinSource
 * @type {Record<string, BuiltinSource>}
 */
export const BUILTIN_SOURCES = {
  empresas: { idKey: 'id', rows: (store, tenantId) => store.data(tenantId).empresas },
  // INEI codes nest by prefix; a ref must be a distrito (6 digits), joins may use any level.
  ubigeo: {
    idKey: 'id',
    rows: (store) => store.shared.ubigeo,
    refFilter: (row) => row.id.length === 6,
    refMessage: 'must be an existing distrito',
    // `lookups/ubigeo?parent=` answers through this named rule (R-MOCK-16) instead of exact-matching rows.
    lookupRule: 'ubigeoChildren',
    // With `has=<catalog>` the request is answered by `ubigeoHasActive` (only the ubigeos holding an active row of that catalog).
    lookupRuleBy: { has: 'ubigeoHasActive' },
  },
};
