import { MockError } from './errors.js';

/**
 * Session context of one request (R-MOCK-13): the `X-User-Id` and `X-Empresa-Id`
 * headers over HTTP, the same values from the session store in the in-browser mock.
 * @typedef {{ userId?: string|number, empresaId?: string|number }} RequestContext
 */

/** Value of a static `where` that resolves to the session empresa. */
export const SESSION_EMPRESA = '$session.empresa';

const missing = (/** @type {string} */ header) => new MockError(400, 'MISSING_SESSION_CONTEXT', `The ${header} header is required`);

/** Entries that carry the empresa: `scope: 'empresa'` or an `id_empresa` stamp. @param {any} entry */
const usesEmpresa = (entry) => entry.scope === 'empresa' || (entry.stamp ?? []).includes('id_empresa');

/** The session empresa, checked against the tenant. @param {any} store @param {string} tenantId @param {RequestContext} [ctx] */
export function sessionEmpresa(store, tenantId, ctx) {
  const id = String(ctx?.empresaId ?? '').trim();
  if (id === '') throw missing('X-Empresa-Id');
  if (!store.data(tenantId).empresas.some((/** @type {any} */ e) => String(e.id) === id)) {
    throw new MockError(400, 'INVALID_SESSION_CONTEXT', `Unknown empresa for this tenant: ${id}`);
  }
  return id;
}

/** @param {RequestContext} [ctx] */
function sessionUser(ctx) {
  const id = String(ctx?.userId ?? '').trim();
  if (id === '') throw missing('X-User-Id');
  return Number.isInteger(Number(id)) ? Number(id) : id;
}

/**
 * Session-filled values of a write (`stamp` plus the empresa of `scope: 'empresa'`);
 * the body never supplies them. Throws when a needed header is absent.
 * @param {any} store @param {string} tenantId @param {any} entry @param {RequestContext} [ctx]
 */
export function stampsOf(store, tenantId, entry, ctx) {
  /** @type {Record<string, any>} */
  const stamps = {};
  if (usesEmpresa(entry)) stamps.id_empresa = sessionEmpresa(store, tenantId, ctx);
  if ((entry.stamp ?? []).includes('id_usuario')) stamps.id_usuario = sessionUser(ctx);
  return stamps;
}

/**
 * Row filter of an entry: `scope: 'empresa'` shows only the session empresa, any
 * other scope shows everything.
 * @param {any} store @param {string} tenantId @param {any} entry @param {RequestContext} [ctx]
 * @returns {(row: any) => boolean}
 */
export function scopeFilter(store, tenantId, entry, ctx) {
  if (entry.scope !== 'empresa') return () => true;
  const empresa = sessionEmpresa(store, tenantId, ctx);
  return (row) => String(row.id_empresa) === empresa;
}

/**
 * Replaces `$session.empresa` in a static `where` by the session empresa.
 * @param {any} store @param {string} tenantId @param {Record<string, any>} where @param {RequestContext} [ctx]
 */
export function resolveWhere(store, tenantId, where, ctx) {
  return Object.fromEntries(
    Object.entries(where).map(([key, value]) => [key, value === SESSION_EMPRESA ? sessionEmpresa(store, tenantId, ctx) : value]),
  );
}
