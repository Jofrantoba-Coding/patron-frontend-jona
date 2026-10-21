import { MockError } from './errors.js';

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
  const user = store.shared.users.find(
    (/** @type {any} */ u) => u.usuario === usuario && u.clave === clave && u.tenants.includes(tenantId),
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
    user: { id_usuario: user.id_usuario, usuario: user.usuario, nombre: user.nombre },
  };
}

/** Flat MenuDinamico list; the client builds the tree. @param {any} store */
export function getMenu(store) {
  return { items: structuredClone(store.shared.menu) };
}

/**
 * Permission flags of a form. Unknown forms and missing flags are denied.
 * @param {any} store @param {string} formId
 * @returns {Record<(typeof PERMISSION_FLAGS)[number], boolean>}
 */
export function getPermissions(store, formId) {
  const seeded = Object.hasOwn(store.shared.permissions, formId) ? store.shared.permissions[formId] : {};
  return /** @type {any} */ (
    Object.fromEntries(PERMISSION_FLAGS.map((flag) => [flag, seeded[flag] === true]))
  );
}

/** @param {any} store @param {string} tenantId */
export function listEmpresas(store, tenantId) {
  return { items: structuredClone(store.data(tenantId).empresas) };
}

/**
 * Puntos de venta, filtered by empresa when `id_empresa` is given (S-AUTH-10).
 * @param {any} store @param {string} tenantId @param {{ id_empresa?: string }} [query]
 */
export function listPuntosVenta(store, tenantId, query = {}) {
  const all = store.data(tenantId).puntosVenta;
  const items = query.id_empresa === undefined
    ? all
    : all.filter((/** @type {any} */ p) => p.id_empresa === query.id_empresa);
  return { items: structuredClone(items) };
}

/** BdEmpresaParametro flags as data only. @param {any} store @param {string} tenantId */
export function getParams(store, tenantId) {
  return structuredClone(store.data(tenantId).params);
}
