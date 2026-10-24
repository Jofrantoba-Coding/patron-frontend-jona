import { MockError } from './errors.js';
import { allPermissions, effectiveFlags, effectiveMenu } from './grants.js';
import { hashPassword } from './password.js';

/** The 13 per-form permission flags (see `RnUsuario.cargaFormularioPerfil`). */
export const PERMISSION_FLAGS = /** @type {const} */ ([
  'add', 'modify', 'eliminate', 'nullify', 'clone', 'details', 'search',
  'report', 'export', 'print', 'printFast', 'close', 'refresh',
]);

/** @typedef {{ usuario?: string, clave?: string }} Credentials */

const invalidCredentials = () =>
  new MockError(401, 'INVALID_CREDENTIALS', 'Invalid user or password');

/** Public tenant list for the login screen (BdEmpresa options). @param {any} store */
export function sessionOptions(store) {
  return { items: store.tenants() };
}

/**
 * Validates credentials inside a tenant. Credentials are checked first so a
 * wrong password never reveals whether the account is disabled.
 * @param {any} store @param {string} tenantId @param {Credentials} credentials
 */
export function login(store, tenantId, credentials) {
  const { usuario = '', clave = '' } = credentials ?? {};
  // One compare path over the stored hash (D16); a logically deleted user is as good as unknown (R-AUTH-10).
  const user = store.shared.users.find(
    (/** @type {any} */ u) => u.activo !== false && u.usuario === usuario && u.tenants.includes(tenantId) && u.clave_hash === hashPassword(u.id_usuario, clave),
  );
  if (!user || usuario === '') throw invalidCredentials();
  if (user.flaghabilitado === 'D') {
    throw new MockError(403, 'USER_DISABLED', 'The user is disabled');
  }
  if (user.flagEscritorio === 'N') {
    throw new MockError(403, 'NO_DESKTOP_ACCESS', 'The user has no desktop access');
  }
  return {
    token: `mock-token-${user.id_usuario}-${tenantId}`,
    user: { id_usuario: Number(user.id_usuario), usuario: user.usuario, nombre: user.nombre },
  };
}

/**
 * Flat MenuDinamico list; the client builds the tree. For a user whose trabajador has a perfil the unchecked nodes are omitted (R-AUTH-11);
 * with no user it is the seeded list.
 * @param {any} store @param {import('./grants.js').GrantContext} [ctx]
 */
export function getMenu(store, ctx) {
  return { items: effectiveMenu(store, ctx) };
}

/**
 * Permission flags of a form for the acting user's perfil; with no user the seeded flags. Unknown forms and missing flags are denied.
 * @param {any} store @param {string} formId @param {import('./grants.js').GrantContext} [ctx]
 * @returns {Record<(typeof PERMISSION_FLAGS)[number], boolean>}
 */
export function getPermissions(store, formId, ctx) {
  return /** @type {any} */ (effectiveFlags(store, formId, ctx));
}

/** The flags of every form for the acting user, `{ [formId]: flags }`. @param {any} store @param {import('./grants.js').GrantContext} [ctx] */
export function getAllPermissions(store, ctx) {
  return allPermissions(store, ctx);
}

/** A row of a W1 section the Wave 2 `empresa` / `punto-venta` entries also write: active rows only (R-REG-12). @param {any} row */
const isActive = (row) => row.activo !== false;

/** @param {any} store @param {string} tenantId */
export function listEmpresas(store, tenantId) {
  // The W1 item shape, whatever else the Wave 2 entry stores in the same row (S-MOCK-34).
  return { items: store.data(tenantId).empresas.filter(isActive).map((/** @type {any} */ e) => ({ id: e.id, name: e.name })) };
}

/**
 * Puntos de venta, filtered by empresa when `id_empresa` is given (S-AUTH-10).
 * @param {any} store @param {string} tenantId @param {{ id_empresa?: string }} [query]
 */
export function listPuntosVenta(store, tenantId, query = {}) {
  const all = store.data(tenantId).puntosVenta.filter(isActive);
  const items = query.id_empresa === undefined
    ? all
    : all.filter((/** @type {any} */ p) => p.id_empresa === query.id_empresa);
  return { items: items.map((/** @type {any} */ p) => ({ id: p.id, name: p.name, id_empresa: p.id_empresa })) };
}

/** BdEmpresaParametro flags as data only. @param {any} store @param {string} tenantId */
export function getParams(store, tenantId) {
  return structuredClone(store.data(tenantId).params);
}
