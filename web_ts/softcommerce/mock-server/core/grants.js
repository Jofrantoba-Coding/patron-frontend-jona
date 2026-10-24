import { PERMISSION_FLAGS } from './auth.js';
import { notFound, validationError } from './errors.js';

/**
 * Per-perfil grants (R-PRM-5, R-AUTH-11, D17). `menu.json` and `permissions.json` stay the defaults every perfil starts from; the edits are
 * overrides `{ id_tipo_perfil, kind: 'menu' | 'form', key, flag?, value }` in the tenant section `perfil-overrides`. A user reaches its perfil
 * through the trabajador (user -> `id_trabajador` -> `id_tipo_perfil`); with no user, no trabajador or no overrides the answer is the defaults.
 * @typedef {import('./context.js').RequestContext & { tenantId?: string }} GrantContext
 */

const SECTION = 'perfil-overrides';

/** @param {any} store @param {string} tenantId */
const overridesOf = (store, tenantId) => /** @type {any[]} */ (store.data(tenantId)[SECTION]);

/** The perfil id of the acting user, or `undefined` (no user, no trabajador, unknown trabajador). @param {any} store @param {GrantContext} [ctx] */
export function perfilOfUser(store, ctx) {
  const userId = String(ctx?.userId ?? '').trim();
  const tenantId = ctx?.tenantId;
  if (userId === '' || !tenantId || !store.hasTenant(tenantId)) return undefined;
  const user = store.shared.users.find((/** @type {any} */ u) => String(u.id_usuario) === userId);
  const idTrabajador = String(user?.id_trabajador ?? '');
  if (idTrabajador === '') return undefined;
  const trabajador = (store.data(tenantId).trabajadores ?? []).find((/** @type {any} */ t) => String(t.id_trabajador) === idTrabajador);
  return trabajador?.id_tipo_perfil === undefined ? undefined : String(trabajador.id_tipo_perfil);
}

/** The ids of the menu nodes the perfil unchecked. @param {any} store @param {string} tenantId @param {string} perfil */
const hiddenNodes = (store, tenantId, perfil) =>
  new Set(overridesOf(store, tenantId).filter((o) => o.id_tipo_perfil === perfil && o.kind === 'menu' && o.value === false).map((o) => o.key));

/** The flat menu of the acting user's perfil: the defaults minus the nodes the perfil unchecked (no propagation to children). @param {any} store @param {GrantContext} [ctx] */
export function effectiveMenu(store, ctx) {
  const perfil = perfilOfUser(store, ctx);
  const hidden = perfil === undefined ? new Set() : hiddenNodes(store, /** @type {string} */ (ctx?.tenantId), perfil);
  return store.shared.menu.filter((/** @type {any} */ node) => !hidden.has(String(node.id_menu))).map((/** @type {any} */ node) => structuredClone(node));
}

/** Flags of a form for a perfil: the seeded flags overlaid with its overrides; unknown forms and missing flags are denied. @param {any} store @param {string} formId @param {{ tenantId: string, perfil: string }} [scope] */
export function flagsOf(store, formId, scope) {
  const seeded = Object.hasOwn(store.shared.permissions, formId) ? store.shared.permissions[formId] : {};
  const flags = Object.fromEntries(PERMISSION_FLAGS.map((flag) => [flag, seeded[flag] === true]));
  if (scope) {
    for (const o of overridesOf(store, scope.tenantId)) {
      if (o.id_tipo_perfil === scope.perfil && o.kind === 'form' && o.key === formId && Object.hasOwn(flags, o.flag)) flags[o.flag] = o.value === true;
    }
  }
  return flags;
}

/** The flags of a form for the acting user. @param {any} store @param {string} formId @param {GrantContext} [ctx] */
export function effectiveFlags(store, formId, ctx) {
  const perfil = perfilOfUser(store, ctx);
  return flagsOf(store, formId, perfil === undefined ? undefined : { tenantId: /** @type {string} */ (ctx?.tenantId), perfil });
}

/** The flags of every form for the acting user, `{ [formId]: flags }` (S-MOCK-58). @param {any} store @param {GrantContext} [ctx] */
export function allPermissions(store, ctx) {
  return Object.fromEntries(Object.keys(store.shared.permissions).map((formId) => [formId, effectiveFlags(store, formId, ctx)]));
}

/** A perfil of the tenant; a logically deleted one is as good as unknown. @param {any} store @param {string} tenantId @param {string} id */
function requirePerfil(store, tenantId, id) {
  const found = store.data(tenantId)['tipos-trabajador-perfil'].some((/** @type {any} */ p) => String(p.id_tipo_perfil) === id && p.activo !== false);
  if (!found) throw notFound(`Unknown perfil: ${id}`);
  return id;
}

/** The changed cells of a PUT body: a list or `{ items }`. @param {any} body */
const changesOf = (body) => (Array.isArray(body) ? body : Array.isArray(body?.items) ? body.items : []);

/** @param {any} store @param {string} tenantId @param {string} perfil @param {Record<string, any>} key @param {boolean} value */
function upsert(store, tenantId, perfil, key, value) {
  const rows = overridesOf(store, tenantId);
  const same = rows.find((o) => o.id_tipo_perfil === perfil && o.kind === key.kind && o.key === key.key && o.flag === key.flag);
  if (same) same.value = value;
  else rows.push({ id_tipo_perfil: perfil, ...key, value });
}

/** The menu of a perfil with the visibility of every node (an unknown perfil is a 404). @param {any} store @param {string} tenantId @param {string} id */
export function getPerfilMenu(store, tenantId, id) {
  const perfil = requirePerfil(store, tenantId, id);
  const hidden = hiddenNodes(store, tenantId, perfil);
  return { items: store.shared.menu.map((/** @type {any} */ node) => ({ ...structuredClone(node), visible: !hidden.has(String(node.id_menu)) })) };
}

/** Stores the changed nodes `{ id, visible }`; the whole body is rejected when any node is unknown. @param {any} store @param {string} tenantId @param {string} id @param {any} body */
export function putPerfilMenu(store, tenantId, id, body) {
  const perfil = requirePerfil(store, tenantId, id);
  const changes = changesOf(body);
  const known = new Set(store.shared.menu.map((/** @type {any} */ n) => String(n.id_menu)));
  /** @type {import('./errors.js').FieldDetail[]} */
  const details = [];
  changes.forEach((/** @type {any} */ change, /** @type {number} */ i) => {
    if (!known.has(String(change?.id))) details.push({ field: `items[${i}].id`, message: `Unknown menu node: ${change?.id}` });
    if (typeof change?.visible !== 'boolean') details.push({ field: `items[${i}].visible`, message: 'visible must be true or false' });
  });
  if (details.length > 0) throw validationError(details);
  for (const change of changes) upsert(store, tenantId, perfil, { kind: 'menu', key: String(change.id) }, change.visible);
  return getPerfilMenu(store, tenantId, id);
}

/** Every form of the app with its 13 flags for a perfil. @param {any} store @param {string} tenantId @param {string} id */
export function getPerfilPermisos(store, tenantId, id) {
  const perfil = requirePerfil(store, tenantId, id);
  return { items: Object.keys(store.shared.permissions).map((formId) => ({ formId, ...flagsOf(store, formId, { tenantId, perfil }) })) };
}

/** The 13 flags of one form for a perfil. @param {any} store @param {string} tenantId @param {string} id @param {string} formId */
export function getPerfilPermiso(store, tenantId, id, formId) {
  const perfil = requirePerfil(store, tenantId, id);
  if (!Object.hasOwn(store.shared.permissions, formId)) throw notFound(`Unknown form: ${formId}`);
  return flagsOf(store, formId, { tenantId, perfil });
}

/**
 * Stores the changed cells `{ formId, flag, value }`; `onlyFormId` is the single-form route, where the form comes from the path. All or nothing.
 * @param {any} store @param {string} tenantId @param {string} id @param {any} body @param {string} [onlyFormId]
 */
export function putPerfilPermisos(store, tenantId, id, body, onlyFormId) {
  const perfil = requirePerfil(store, tenantId, id);
  const changes = changesOf(body).map((/** @type {any} */ change) => ({ ...change, formId: change?.formId ?? onlyFormId }));
  /** @type {import('./errors.js').FieldDetail[]} */
  const details = [];
  if (onlyFormId !== undefined && !Object.hasOwn(store.shared.permissions, onlyFormId)) details.push({ field: 'formId', message: `Unknown form: ${onlyFormId}` });
  changes.forEach((/** @type {any} */ change, /** @type {number} */ i) => {
    if (!Object.hasOwn(store.shared.permissions, String(change.formId)) || (onlyFormId !== undefined && change.formId !== onlyFormId)) {
      details.push({ field: `items[${i}].formId`, message: `Unknown form: ${change.formId}` });
    }
    if (!PERMISSION_FLAGS.includes(change?.flag)) details.push({ field: `items[${i}].flag`, message: `Unknown flag: ${change?.flag}` });
    if (typeof change?.value !== 'boolean') details.push({ field: `items[${i}].value`, message: 'value must be true or false' });
  });
  if (details.length > 0) throw validationError(details);
  for (const change of changes) upsert(store, tenantId, perfil, { kind: 'form', key: change.formId, flag: change.flag }, change.value);
  return onlyFormId === undefined ? getPerfilPermisos(store, tenantId, id) : flagsOf(store, onlyFormId, { tenantId, perfil });
}
