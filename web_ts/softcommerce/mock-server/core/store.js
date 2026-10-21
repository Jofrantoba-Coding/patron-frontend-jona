import { MockError } from './errors.js';

/**
 * @typedef {{ id: string, name: string }} Tenant
 * @typedef {{ empresas: any[], puntosVenta: any[], localidades: any[], params: Record<string, any> }} TenantData
 * @typedef {{ users: any[], menu: any[], permissions: Record<string, any>, ubigeo: any[] }} SharedData
 */

/** Seed sections that are keyed by tenant id. */
const TENANT_SECTIONS = ['empresas', 'puntosVenta', 'localidades', 'params'];

/**
 * Builds an independent mutable copy of the seed.
 * @param {Record<string, any>} seed
 */
function snapshot(seed) {
  /** @type {Record<string, TenantData>} */
  const tenants = {};
  for (const { id } of seed.tenants) {
    tenants[id] = /** @type {TenantData} */ (
      Object.fromEntries(TENANT_SECTIONS.map((s) => [s, structuredClone(seed[s][id])]))
    );
  }
  return {
    tenantList: /** @type {Tenant[]} */ (structuredClone(seed.tenants)),
    shared: /** @type {SharedData} */ ({
      users: structuredClone(seed.users),
      menu: structuredClone(seed.menu),
      permissions: structuredClone(seed.permissions),
      ubigeo: structuredClone(seed.ubigeo),
    }),
    tenants,
  };
}

/**
 * In-memory store over a JSON seed. The seed is cloned on creation and on
 * every reset, so callers can never mutate it (S-MOCK-14).
 * @param {Record<string, any>} seed
 */
export function createStore(seed) {
  const pristine = structuredClone(seed);
  let state = snapshot(pristine);

  return {
    /** Restores every dataset to the seed. */
    reset() {
      state = snapshot(pristine);
    },
    tenants: () => structuredClone(state.tenantList),
    /** @param {string} id */
    hasTenant: (id) => Object.hasOwn(state.tenants, id),
    /** Tenant-independent data (read-only by convention). */
    get shared() {
      return state.shared;
    },
    /**
     * Mutable dataset of one tenant (BdEmpresa).
     * @param {string} tenantId
     * @returns {TenantData}
     */
    data(tenantId) {
      if (!Object.hasOwn(state.tenants, tenantId)) {
        throw new MockError(404, 'TENANT_NOT_FOUND', `Unknown tenant: ${tenantId}`);
      }
      return state.tenants[tenantId];
    },
  };
}
