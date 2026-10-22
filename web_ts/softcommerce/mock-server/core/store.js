import { REGISTRY } from '../registry/index.js';
import { MockError } from './errors.js';

/**
 * @typedef {{ id: string, name: string }} Tenant
 * @typedef {{ empresas: any[], puntosVenta: any[], localidades: any[], params: Record<string, any>, [section: string]: any }} TenantData
 * @typedef {{ users: any[], menu: any[], permissions: Record<string, any>, ubigeo: any[], [section: string]: any }} SharedData
 */

/** W1 seed sections keyed by tenant id; registry entries add theirs by scope. */
const TENANT_SECTIONS = ['empresas', 'puntosVenta', 'localidades', 'params'];

/** @param {ReturnType<typeof import('../registry/schema.js').validateRegistry>} registry @param {boolean} shared */
const sectionsOf = (registry, shared) =>
  registry.entries.filter((e) => (e.scope === 'shared') === shared).map((e) => e.section);

/**
 * Builds an independent mutable copy of the seed. Store sections come from the
 * registry `scope`: `tenant`/`empresa` per tenant (a missing tenant gets `[]`),
 * `shared` once globally (R-REG-5).
 * @param {Record<string, any>} seed
 * @param {ReturnType<typeof import('../registry/schema.js').validateRegistry>} registry
 */
function snapshot(seed, registry) {
  const tenantSections = [...new Set([...TENANT_SECTIONS, ...sectionsOf(registry, false)])];
  /** @type {Record<string, TenantData>} */
  const tenants = {};
  for (const { id } of seed.tenants) {
    tenants[id] = /** @type {TenantData} */ (
      Object.fromEntries(tenantSections.map((s) => [s, structuredClone(seed[s]?.[id] ?? [])]))
    );
  }
  return {
    tenantList: /** @type {Tenant[]} */ (structuredClone(seed.tenants)),
    shared: /** @type {SharedData} */ ({
      users: structuredClone(seed.users),
      menu: structuredClone(seed.menu),
      permissions: structuredClone(seed.permissions),
      ubigeo: structuredClone(seed.ubigeo),
      ...Object.fromEntries(sectionsOf(registry, true).map((s) => [s, structuredClone(seed[s] ?? [])])),
    }),
    tenants,
  };
}

/**
 * In-memory store over a JSON seed. The seed is cloned on creation and on
 * every reset, so callers can never mutate it (S-MOCK-14).
 * @param {Record<string, any>} seed
 * @param {ReturnType<typeof import('../registry/schema.js').validateRegistry>} [registry]
 */
export function createStore(seed, registry = REGISTRY) {
  const pristine = structuredClone(seed);
  let state = snapshot(pristine, registry);

  return {
    registry,
    /** Restores every dataset to the seed. */
    reset() {
      state = snapshot(pristine, registry);
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
