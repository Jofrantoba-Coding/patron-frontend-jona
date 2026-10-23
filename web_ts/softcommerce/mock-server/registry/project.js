/**
 * Closed set of projections (`entry.project`, R-REG-2): a tenant section derived from a seed section that is already loaded, so the data
 * keeps a single source and never gets a copy of its own. `rows` builds the section of one tenant from the whole seed.
 * @type {Record<string, { rows: (seed: Record<string, any>, tenantId: string) => any[] }>}
 */
export const PROJECTIONS = {
  // The auth users that may log in to the tenant (`tenants` of users.json), without the password. The id is text like every other id.
  users: {
    rows: (seed, tenantId) =>
      (seed.users ?? [])
        .filter((/** @type {any} */ user) => (user.tenants ?? []).includes(tenantId))
        .map((/** @type {any} */ { id_usuario, usuario, nombre }) => ({ id_usuario: String(id_usuario), usuario, nombre })),
  },
};
