import { REGISTRY } from '../registry/index.js';
import { BACKINGS } from '../registry/backings.js';
import { PROJECTIONS } from '../registry/project.js';
import { MockError } from './errors.js';

/**
 * @typedef {{ id: string, name: string }} Tenant
 * @typedef {{ empresas: any[], puntosVenta: any[], localidades: any[], params: Record<string, any>, [section: string]: any }} TenantData
 * @typedef {{ users: any[], menu: any[], permissions: Record<string, any>, ubigeo: any[], [section: string]: any }} SharedData
 */

/** W1 seed sections keyed by tenant id; registry entries (Localidad included) add theirs by scope. */
const TENANT_SECTIONS = ['empresas', 'puntosVenta', 'params'];

/** @param {ReturnType<typeof import('../registry/schema.js').validateRegistry>} registry @param {boolean} shared */
const sectionsOf = (registry, shared) =>
  [...registry.entries, ...(registry.childEntries ?? []).filter((c) => c.store === undefined)].filter((e) => (e.scope === 'shared') === shared).map((e) => e.section);

/**
 * Splits the child rows nested in the parent seed rows (R-REG-14) into the child sections: each child row links to its parent through
 * `parentKey`, takes the parent's `id_empresa` when the scope is `empresa`, and gets the next id when the seed gives none. Returns the
 * parent rows without the nested lists, so a parent section never holds child data.
 * @param {ReturnType<typeof import('../registry/schema.js').validateRegistry>} registry @param {any} parent @param {any[]} rows
 * @returns {{ parents: any[], children: Record<string, any[]> }}
 */
function splitChildren(registry, parent, rows) {
  // A store child has no section or seed of its own: its rows are the owning entry's (R-REG-14).
  const kids = (registry.childEntries ?? []).filter((c) => c.parent === parent.slug && c.store === undefined);
  /** @type {Record<string, any[]>} */
  const children = Object.fromEntries(kids.map((c) => [c.section, []]));
  const parents = rows.map((row) => {
    const { ...rest } = row;
    for (const kid of kids) {
      const nested = rest[kid.childName];
      delete rest[kid.childName];
      for (const child of nested ?? []) {
        const id = child.id ?? String(children[kid.section].length + 1);
        children[kid.section].push({ ...child, id, [kid.parentKey]: row[parent.idKey], ...(kid.scope === 'empresa' ? { id_empresa: row.id_empresa } : {}), estado: child.estado ?? 'A' });
      }
    }
    return rest;
  });
  return { parents, children };
}

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
    for (const parent of registry.entries.filter((e) => e.scope !== 'shared' && e.children !== undefined)) {
      const { parents, children } = splitChildren(registry, parent, tenants[id][parent.section]);
      tenants[id][parent.section] = parents;
      Object.assign(tenants[id], children);
    }
    // A projected entry (the auth users) takes its rows from another seed section, so there is one source (R-REG-2).
    for (const entry of registry.entries.filter((e) => e.project !== undefined)) tenants[id][entry.section] = PROJECTIONS[entry.project].rows(seed, id);
  }
  const shared = Object.fromEntries(sectionsOf(registry, true).map((s) => [s, structuredClone(seed[s] ?? [])]));
  for (const parent of registry.entries.filter((e) => e.scope === 'shared' && e.children !== undefined)) {
    const { parents, children } = splitChildren(registry, parent, shared[parent.section]);
    shared[parent.section] = parents;
    Object.assign(shared, children);
  }
  return {
    tenantList: /** @type {Tenant[]} */ (structuredClone(seed.tenants)),
    shared: /** @type {SharedData} */ ({
      users: BACKINGS.users.seed(structuredClone(seed.users)),
      menu: structuredClone(seed.menu),
      permissions: structuredClone(seed.permissions),
      ubigeo: structuredClone(seed.ubigeo),
      ...shared,
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
