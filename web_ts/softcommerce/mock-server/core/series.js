import { scopeFilter, stampsOf } from './context.js';
import { isIsoDate, todayIso } from './dates.js';
import { actionNotAllowed, MockError, notFound, validationError } from './errors.js';
import { fieldMessage } from './messages.js';
import { withRuleDerived } from './stored.js';
import { same } from './unique.js';
import { ACTIVE_KEY, rowsOf, validateRecord } from './validators.js';

/**
 * The server actions of Autorizar Series (R-PRM-6, R-PRM-7, S-MOCK-56, D14). The series of a usuario are the W2 `usuario-correlativos` rows (a store child), so
 * the pair (usuario, correlativo) keeps its W2 unique key and message and `habilitar` is the authorization estado. `activarSerie` is the collection form: it
 * creates the row, or re-activates the deactivated row of the pair [ASSUMPTION]; `desactivarSerie` is the row form.
 */

const ACTIVADA = 'Serie autorizada';
const DESACTIVADA = 'Serie desactivada';
const YA_DESACTIVADA = 'La serie ya esta desactivada';

/** The localidad of a punto de venta, or null when there is no such active punto de venta. @param {any} store @param {string} tenantId @param {unknown} id */
function localidadOf(store, tenantId, id) {
  const punto = store.registry.bySlug.get('punto-venta');
  const row = rowsOf(store, tenantId, punto).find((/** @type {any} */ r) => same(r[punto.idKey], id) && r[ACTIVE_KEY] !== false);
  return row ? String(row.id_localidad ?? '') : null;
}

/**
 * Collection form: `{ id_punto_venta, id_tipo_doc, id_correlativo, fecha_inicio? }`. The localidad comes from the punto de venta; the pair is checked with the W2
 * chain and unique key, and an ACTIVE pair answers 409 with the W2 literal.
 * @param {{ store: any, tenantId: string, entry: any, parent: any, parentRow: any, input: Record<string, any>, ctx?: import('./context.js').RequestContext }} call
 */
export function activarSerie({ store, tenantId, entry, parent, parentRow, input, ctx }) {
  const parentId = String(parentRow[parent.idKey]);
  const field = (/** @type {string} */ name) => entry.fields.find((/** @type {any} */ f) => f.name === name);
  const text = (/** @type {string} */ name) => String(input[name] ?? '').trim();
  const localidad = localidadOf(store, tenantId, text('id_punto_venta'));
  if (localidad === null) {
    const blank = text('id_punto_venta') === '';
    throw validationError([{ field: 'id_punto_venta', code: blank ? 'REQUIRED' : 'REF_NOT_FOUND', message: blank ? fieldMessage(entry, field('id_punto_venta'), 'REQUIRED', 'INSERT') : 'id_punto_venta does not exist' }]);
  }
  const inicio = text('fecha_inicio') || todayIso();
  if (!isIsoDate(inicio)) throw validationError([{ field: 'fecha_inicio', code: 'DATE', message: 'fecha_inicio must be a valid date' }]);
  const record = { id_usuario: parentId, id_localidad: localidad, id_punto_venta: text('id_punto_venta'), id_tipo_doc: text('id_tipo_doc'), id_correlativo: text('id_correlativo'), habilitar: true };

  const rows = rowsOf(store, tenantId, entry);
  const inScope = scopeFilter(store, tenantId, entry, ctx);
  const mine = rows.filter((/** @type {any} */ r) => String(r[entry.parentKey]) === parentId && r[ACTIVE_KEY] !== false && inScope(r));
  // A deactivated row of the pair is re-activated, so it does not count against the unique key.
  const held = mine.find((/** @type {any} */ r) => r.habilitar === false && same(r.id_correlativo, record.id_correlativo));
  try {
    validateRecord(store, tenantId, entry, record, { ctx, mode: 'INSERT', parentId, siblings: mine.filter((/** @type {any} */ r) => r !== held).map((/** @type {any} */ r) => ({ ...r })) });
  } catch (error) {
    // The unique key is the W2 one; here it is an action the state of the pair does not allow (R-MOCK-22), with the same sentence.
    if (error instanceof MockError && error.status === 409) throw new MockError(409, 'ACTION_NOT_ALLOWED', error.details[0].message, error.details);
    throw error;
  }
  if (held) {
    Object.assign(held, { habilitar: true, fecha_inicio: inicio, fecha_fin: '' });
    return { id: held[entry.idKey], message: ACTIVADA };
  }
  const next = rows.reduce((/** @type {number} */ max, /** @type {any} */ r) => Math.max(max, Number(r[entry.idKey]) || 0), 0) + 1;
  const id = String(next).padStart(entry.codeWidth, '0');
  rows.push({ [entry.idKey]: id, ...withRuleDerived(entry, { ...record, fecha_inicio: inicio }), ...entry.constants, ...stampsOf(store, tenantId, entry, ctx), [ACTIVE_KEY]: true });
  return { id, message: ACTIVADA };
}

/**
 * Row form: the authorization turns deactivated with fecha fin today. A row that is already deactivated answers 409 [INFERRED].
 * @param {{ store: any, tenantId: string, entry: any, row: any, ctx?: import('./context.js').RequestContext }} call
 */
export function desactivarSerie({ store, tenantId, entry, row, ctx }) {
  if (!scopeFilter(store, tenantId, entry, ctx)(row)) throw notFound(`${entry.slug} ${row[entry.idKey]} not found`);
  if (row.habilitar === false) throw actionNotAllowed(YA_DESACTIVADA);
  Object.assign(row, { habilitar: false, fecha_fin: todayIso() });
  return { message: DESACTIVADA };
}
