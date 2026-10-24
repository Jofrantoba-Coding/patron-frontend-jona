import { createRecord, deleteRecord, getRecord, listCatalog, updateRecord } from './catalog.js';
import { childEntryOf, liveParent } from './children.js';

/**
 * Nested child routes `/v1/{slug}/{id}/{child}[/{childId}]` (R-MOCK-19, D7): the parent is checked once (404 when unknown, deleted, of another tenant or
 * of another empresa), then the call runs on the child entry bound to that parent.
 * @param {any} store @param {string} tenantId @param {string} parentSlug @param {string} id @param {string} name @param {import('./context.js').RequestContext} [ctx]
 */
function bind(store, tenantId, parentSlug, id, name, ctx) {
  const child = childEntryOf(store, parentSlug, name);
  liveParent(store, tenantId, child, id, ctx);
  return { slug: child.slug, link: { key: child.parentKey, id } };
}

/** @param {any} store @param {string} tenantId @param {string} parent @param {string} id @param {string} name @param {Record<string, any>} [query] @param {import('./context.js').RequestContext} [ctx] */
export function listChild(store, tenantId, parent, id, name, query, ctx) {
  const { slug, link } = bind(store, tenantId, parent, id, name, ctx);
  return listCatalog(store, tenantId, slug, query, ctx, link);
}

/** @param {any} store @param {string} tenantId @param {string} parent @param {string} id @param {string} name @param {string} childId @param {import('./context.js').RequestContext} [ctx] */
export function getChild(store, tenantId, parent, id, name, childId, ctx) {
  const { slug, link } = bind(store, tenantId, parent, id, name, ctx);
  return getRecord(store, tenantId, slug, childId, ctx, link);
}

/** @param {any} store @param {string} tenantId @param {string} parent @param {string} id @param {string} name @param {Record<string, any>} body @param {import('./context.js').RequestContext} [ctx] */
export function createChild(store, tenantId, parent, id, name, body, ctx) {
  const { slug, link } = bind(store, tenantId, parent, id, name, ctx);
  return createRecord(store, tenantId, slug, body, ctx, link);
}

/** @param {any} store @param {string} tenantId @param {string} parent @param {string} id @param {string} name @param {string} childId @param {Record<string, any>} body @param {import('./context.js').RequestContext} [ctx] */
export function updateChild(store, tenantId, parent, id, name, childId, body, ctx) {
  const { slug, link } = bind(store, tenantId, parent, id, name, ctx);
  return updateRecord(store, tenantId, slug, childId, body, ctx, link);
}

/** @param {any} store @param {string} tenantId @param {string} parent @param {string} id @param {string} name @param {string} childId @param {import('./context.js').RequestContext} [ctx] */
export function removeChild(store, tenantId, parent, id, name, childId, ctx) {
  const { slug, link } = bind(store, tenantId, parent, id, name, ctx);
  deleteRecord(store, tenantId, slug, childId, ctx, link);
}
