import { activarAnexo, desactivarAnexo } from './activacion.js';
import { getRecord } from './catalog.js';
import { gatedChildOf, liveParent } from './children.js';
import { MockError, notFound, validationError } from './errors.js';
import { getChild } from './nested.js';
import { activarSerie, desactivarSerie } from './series.js';
import { ACTIVE_KEY, rowsOf } from './validators.js';

/**
 * Row actions (R-MOCK-22, D12). An `immediate` action declared on an entry or a child names its `server` action; the server action is a hook that runs the
 * rule in one write: it changes the store, answers `{ id?, message? }` and rejects with `actionNotAllowed` (409) or `validationError` (422). The set is
 * `activarAnexo` and `desactivarAnexo` are the anexo history actions (W3-7); `activarSerie` and `desactivarSerie` are those of Autorizar Series (W3-14).
 *
 * A hook gets `{ store, tenantId, entry, parent, parentRow, row, input, ctx }`: `entry` is the entry that declares the action (the child, for a nested one),
 * `parent` its parent entry (absent for an entry action), `parentRow` the stored parent row, `row` the stored row the action targets (the parent row for an
 * entry action, absent for the collection form) and `input` the body.
 * @type {Record<string, (call: any) => { id?: string, message?: string } | void>}
 */
export const ACTION_HOOKS = { activarAnexo, desactivarAnexo, activarSerie, desactivarSerie };

/** The body of an action call is its input: absent is empty, anything but an object is refused. @param {unknown} body @returns {Record<string, any>} */
function inputOf(body) {
  if (body === undefined || body === null) return {};
  if (typeof body !== 'object' || Array.isArray(body)) throw validationError([{ field: 'body', code: 'INVALID', message: 'body must be an object' }]);
  return /** @type {Record<string, any>} */ (body);
}

/** The immediate action `id` of an entry; a deferred one has no endpoint (R-ACT-4). @param {any} entry @param {string} id */
function immediateAction(entry, id) {
  const action = (entry.actions ?? []).find((/** @type {any} */ a) => a.id === id && a.kind === 'immediate');
  if (!action) throw notFound(`Unknown action "${id}" of ${entry.slug}`);
  return action;
}

/** @param {any} action */
function hookOf(action) {
  const hook = ACTION_HOOKS[action.server];
  if (!hook) throw new MockError(501, 'NOT_IMPLEMENTED', `Action "${action.id}" has no server implementation`);
  return hook;
}

/**
 * `POST /v1/{slug}/{id}/actions/{action}`: an action of the entry on one of its rows. Answers the updated row and the rule's message.
 * @param {any} store @param {string} tenantId @param {string} slug @param {string} id @param {string} actionId @param {unknown} body @param {import('./context.js').RequestContext} [ctx]
 */
export function runEntryAction(store, tenantId, slug, id, actionId, body, ctx) {
  const entry = store.registry.bySlug.get(slug);
  if (!entry || entry.parent !== undefined) throw notFound(`Unknown catalog: ${slug}`);
  const row = liveParent(store, tenantId, { parent: slug }, id, ctx);
  const action = immediateAction(entry, actionId);
  const input = inputOf(body);
  const result = hookOf(action)({ store, tenantId, entry, row, parentRow: row, input, ctx }) ?? {};
  return { row: getRecord(store, tenantId, slug, id, ctx), ...(result.message !== undefined && { message: result.message }) };
}

/**
 * `POST /v1/{slug}/{id}/{child}/{childId}/actions/{action}` (an action on an existing child row) and `POST /v1/{slug}/{id}/{child}/actions/{action}` (no
 * `childId`: the action creates the row, as Autorizar Series `activate`). Answers the child row, the parent state and the rule's message.
 * @param {any} store @param {string} tenantId @param {string} slug @param {string} id @param {string} childName @param {string | undefined} childId
 * @param {string} actionId @param {unknown} body @param {import('./context.js').RequestContext} [ctx]
 */
export function runChildAction(store, tenantId, slug, id, childName, childId, actionId, body, ctx) {
  const entry = gatedChildOf(store, tenantId, slug, childName);
  const parentRow = liveParent(store, tenantId, entry, id, ctx);
  const action = immediateAction(entry, actionId);
  const parent = store.registry.bySlug.get(slug);
  const row =
    childId === undefined
      ? undefined
      : rowsOf(store, tenantId, entry).find((/** @type {any} */ r) => r[entry.idKey] === childId && String(r[entry.parentKey]) === String(parentRow[parent.idKey]) && r[ACTIVE_KEY] !== false);
  if (childId !== undefined && !row) throw notFound(`${entry.slug} ${childId} not found`);
  const input = inputOf(body);
  const result = hookOf(action)({ store, tenantId, entry, parent, parentRow, row, input, ctx }) ?? {};
  const rowId = result.id ?? childId;
  return {
    ...(rowId !== undefined && { row: getChild(store, tenantId, slug, id, childName, rowId, ctx) }),
    parent: getRecord(store, tenantId, slug, id, ctx),
    ...(result.message !== undefined && { message: result.message }),
  };
}
