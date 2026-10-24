import { isIsoDate, todayIso } from './dates.js';
import { actionNotAllowed, validationError } from './errors.js';
import { ACTIVE_KEY, rowsOf } from './validators.js';

/**
 * Socio acciones (R-MOCK-26, S-MOCK-54, D26, `FormAccionSocio.guardarAcciones` + `mantAcciones`). One custom resource with no parent record: two global lists of the
 * tenant, the prices and the socios, saved together. `PUT` takes op lists, validates the whole body against a working copy and only then writes, so nothing is
 * persisted on any failure. Ops: `I` inserts an ACTIVE row, `A` updates a stored row (and `estado: 'D'` deactivates it with `fecha_fin`).
 */

export const PRECIOS = 'socio-acciones-precios';
export const SOCIOS = 'socio-acciones-socios';
const OPS = ['I', 'A'];
const GUARDADO = 'Acciones guardadas correctamente';
const MAS_DE_UN_PRECIO = 'No se Puede Agregar mas de un Precio';
const INGRESE_PRECIO = 'Ingrese Precio';
const INGRESE_CANTIDAD = 'Ingrese Cantidad';
const FECHA_MENOR = 'Fecha es menor a fecha inicial';
const SOCIO_ACTIVADO = 'Socio ya esta activado';

/** @param {any} store @param {string} tenantId @param {string} name */
const section = (store, tenantId, name) => /** @type {any[]} */ (store.data(tenantId)[name]);

/** A number the user typed: a blank or non-numeric value is `undefined`. @param {unknown} value */
function amount(value) {
  if (value === undefined || value === null || String(value).trim() === '') return undefined;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

/** @param {string} field @param {string} message @param {string} [code] */
const invalid = (field, message, code = 'REQUIRED') => validationError([{ field, code, message }]);

/** Both lists as stored, with the socio name joined. @param {any} store @param {string} tenantId */
export function getSocioAcciones(store, tenantId) {
  const catalog = rowsOf(store, tenantId, store.registry.bySlug.get('socios'));
  const nameOf = (/** @type {unknown} */ id) => catalog.find((/** @type {any} */ s) => String(s.id_socio) === String(id))?.descripcion ?? '';
  return {
    precios: section(store, tenantId, PRECIOS).map((r) => ({ ...r })),
    socios: section(store, tenantId, SOCIOS).map((r) => ({ ...r, socio: nameOf(r.id_socio) })),
  };
}

/** @param {unknown} body @param {string} name */
function opsOf(body, name) {
  const list = /** @type {any} */ (body ?? {})[name] ?? [];
  if (!Array.isArray(list)) throw invalid(name, `${name} must be a list of operations`, 'INVALID');
  return list;
}

/** @param {any[]} rows @param {string} idKey @param {any} op @param {string} name @param {number} n */
function storedRow(rows, idKey, op, name, n) {
  const row = rows.find((r) => String(r[idKey]) === String(op.id ?? ''));
  if (!row) throw invalid(`${name}[${n}].id`, `${name} ${op.id} does not exist`, 'NOT_FOUND');
  return row;
}

/** The next id of a list, as the string the desktop sequence would give. @param {any[]} rows @param {string} idKey */
const nextId = (rows, idKey) => String(rows.reduce((max, r) => Math.max(max, Number(r[idKey]) || 0), 0) + 1);

/**
 * Applies a body. Order: the price ops (a second active price is a 409), the final price (`Ingrese Precio`, the desktop `validar`), then the socio ops.
 * @param {any} store @param {string} tenantId @param {unknown} body
 */
export function putSocioAcciones(store, tenantId, body) {
  if (body !== undefined && body !== null && (typeof body !== 'object' || Array.isArray(body))) throw invalid('body', 'body must be an object', 'INVALID');
  const precios = section(store, tenantId, PRECIOS);
  const socios = section(store, tenantId, SOCIOS);
  const catalog = rowsOf(store, tenantId, store.registry.bySlug.get('socios'));
  const priceOps = opsOf(body, 'precios');
  const socioOps = opsOf(body, 'socios');

  // The working view: copies of the stored rows; the stored lists are replaced only once everything passed.
  const priceView = precios.map((r) => ({ ...r }));
  const socioView = socios.map((r) => ({ ...r }));
  /** @type {any} */
  let activated;
  priceOps.forEach((op, n) => {
    if (!OPS.includes(op?.op)) throw invalid(`precios[${n}].op`, 'op must be I or A', 'INVALID');
    if (op.op === 'I') {
      if (priceView.some((r) => r.estado === 'A')) throw actionNotAllowed(MAS_DE_UN_PRECIO);
      const precio = amount(op.precio);
      if (precio === undefined) throw invalid(`precios[${n}].precio`, INGRESE_PRECIO);
      const fecha_inicio = String(op.fecha_inicio ?? '') || todayIso();
      if (!isIsoDate(fecha_inicio)) throw invalid(`precios[${n}].fecha_inicio`, 'fecha_inicio must be a valid date', 'DATE');
      activated = { id_accion_precio: `~${n}`, fecha_inicio, fecha_fin: '', estado: 'A', precio };
      priceView.push(activated);
      return;
    }
    const row = storedRow(priceView, 'id_accion_precio', op, 'precios', n);
    if (op.estado === 'D') {
      const fecha_fin = String(op.fecha_fin ?? '') || todayIso();
      if (!isIsoDate(fecha_fin)) throw invalid(`precios[${n}].fecha_fin`, 'fecha_fin must be a valid date', 'DATE');
      if (!(fecha_fin > row.fecha_inicio)) throw invalid(`precios[${n}].fecha_fin`, FECHA_MENOR, 'DATE_ORDER');
      Object.assign(row, { estado: 'D', fecha_fin });
    }
  });
  const current = priceView.find((r) => r.estado === 'A');
  if (!current) throw invalid('precios', INGRESE_PRECIO);

  socioOps.forEach((op, n) => {
    if (!OPS.includes(op?.op)) throw invalid(`socios[${n}].op`, 'op must be I or A', 'INVALID');
    if (op.op === 'I') {
      const cantidad = amount(op.cantidad);
      if (cantidad === undefined) throw invalid(`socios[${n}].cantidad`, INGRESE_CANTIDAD);
      if (!catalog.some((/** @type {any} */ s) => String(s.id_socio) === String(op.id_socio) && s[ACTIVE_KEY] !== false)) throw invalid(`socios[${n}].id_socio`, 'id_socio does not exist', 'REF_NOT_FOUND');
      if (socioView.some((r) => r.estado === 'A' && String(r.id_socio) === String(op.id_socio))) throw actionNotAllowed(SOCIO_ACTIVADO);
      const fecha_inicio = String(op.fecha_inicio ?? '') || todayIso();
      if (!isIsoDate(fecha_inicio)) throw invalid(`socios[${n}].fecha_inicio`, 'fecha_inicio must be a valid date', 'DATE');
      socioView.push({ id_accion_socio: `~${n}`, id_socio: String(op.id_socio), fecha_inicio, fecha_fin: '', estado: 'A', precio: current.precio, cantidad });
      return;
    }
    const row = storedRow(socioView, 'id_accion_socio', op, 'socios', n);
    if (op.estado === 'D') {
      const fecha_fin = String(op.fecha_fin ?? '') || todayIso();
      if (!(fecha_fin > row.fecha_inicio)) throw invalid(`socios[${n}].fecha_fin`, FECHA_MENOR, 'DATE_ORDER');
      Object.assign(row, { estado: 'D', fecha_fin });
    }
  });
  // A newly activated price is applied to every active socio, the ones inserted in this body included (`setValueSearch`).
  if (activated) for (const row of socioView) if (row.estado === 'A') row.precio = activated.precio;

  // Commit: the stored lists become the working view, the new rows getting their ids.
  const commit = (/** @type {any[]} */ target, /** @type {any[]} */ view, /** @type {string} */ idKey) => {
    target.length = 0;
    for (const row of view) target.push(String(row[idKey]).startsWith('~') ? { ...row, [idKey]: nextId(target, idKey) } : row);
  };
  commit(precios, priceView, 'id_accion_precio');
  commit(socios, socioView, 'id_accion_socio');
  return { message: GUARDADO, ...getSocioAcciones(store, tenantId) };
}

/**
 * The seed of the resource, `{ <tenant>: { precios, socios } }` (`data/catalogs/socio-acciones.json`), as the two tenant sections of the store. The resource has no
 * registry entry, so the shared loaders (`loadSeed`, the browser `seed`) do not read it: the two app builders merge this over their seed. No file means empty lists.
 * @param {Record<string, any>} seed @param {unknown} [file]
 */
export function withSocioAccionesSeed(seed, file) {
  if (file === undefined || file === null || typeof file !== 'object') return seed;
  const entries = Object.entries(/** @type {Record<string, any>} */ (file));
  return {
    ...seed,
    [PRECIOS]: Object.fromEntries(entries.map(([tenant, lists]) => [tenant, lists.precios ?? []])),
    [SOCIOS]: Object.fromEntries(entries.map(([tenant, lists]) => [tenant, lists.socios ?? []])),
  };
}
