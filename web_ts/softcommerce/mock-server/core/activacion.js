import { stampsOf } from './context.js';
import { isIsoDate, todayIso } from './dates.js';
import { actionNotAllowed, notFound, validationError } from './errors.js';
import { checkOps, FECHA_MENOR, isActive, lastIsActive, MOTIVO_REQUERIDO } from './activacionRule.js';
import { blankHidden, withDefaults, withRuleDerived } from './stored.js';
import { ACTIVE_KEY, pickWritable, rowsOf, validateRecord } from './validators.js';

/**
 * The store side of the named rule `activacion` (R-ANX-2..5, D13): it checks a composite body against the pure rule (`activacionRule.js`), derives the master
 * `estado` from the last activation row once the write is done, gives a legacy master its `INICIO` row, and serves the two real server actions of the anexo
 * (`activarAnexo`, `desactivarAnexo`, S-MOCK-47..49). The entry names the rule as `rules: [{ name: 'activacion', params: { entity, child } }]`.
 */

/** @param {any} entry */
const ruleOf = (entry) => (entry.rules ?? []).find((/** @type {any} */ r) => r.name === 'activacion');

/** The live rows of one parent in a child section. @param {any} child @param {unknown} parentId */
const ownRows = (child, parentId) => (/** @type {any} */ row) => String(row[child.parentKey]) === String(parentId) && row[ACTIVE_KEY] !== false;

/**
 * Stores one activation row of a parent: the next id of the section, the child constants (`estado` A), the stamps and the parent link.
 * @param {any} store @param {string} tenantId @param {any} child @param {unknown} parentId @param {Record<string, any>} record @param {import('./context.js').RequestContext} [ctx]
 */
function insertRow(store, tenantId, child, parentId, record, ctx) {
  const rows = rowsOf(store, tenantId, child);
  const next = rows.reduce((/** @type {number} */ max, /** @type {any} */ r) => Math.max(max, Number(r[child.idKey]) || 0), 0) + 1;
  const row = { [child.idKey]: String(next).padStart(child.codeWidth, '0'), ...record, ...child.constants, ...stampsOf(store, tenantId, child, ctx), [child.parentKey]: parentId, [ACTIVE_KEY]: true };
  rows.push(row);
  return row;
}

/**
 * After the write: a master with no history gets its `INICIO` row (R-ANX-5, legacy), and the master `estado` becomes the state of the last row (R-ACT-5).
 * @param {any} store @param {string} tenantId @param {any} parent @param {any} child @param {string} parentId @param {import('./context.js').RequestContext} [ctx]
 */
function settle(store, tenantId, parent, child, parentId, ctx) {
  let mine = rowsOf(store, tenantId, child).filter(ownRows(child, parentId));
  if (mine.length === 0) mine = [insertRow(store, tenantId, child, parentId, { f_inicio: todayIso(), motivo_activacion: 'INICIO' }, ctx)];
  const master = rowsOf(store, tenantId, parent).find((/** @type {any} */ r) => r[parent.idKey] === parentId);
  if (master) master.estado = lastIsActive(mine);
}

/**
 * The `activacion` child rule (`CHILD_RULE_HOOKS`): runs after the field validation and before the write. It refuses a body that leaves two active rows
 * (409 `{Entidad} ya Esta Activado`) or breaks the fecha fin / motivo rule (422), and returns what runs after the write.
 * @param {any} store @param {string} tenantId @param {any} parent @param {Record<string, any[]>} planned
 * @param {{ parentId?: string, ctx?: import('./context.js').RequestContext }} [options]
 * @returns {((parentId: string) => void) | undefined}
 */
export function activacionChildHook(store, tenantId, parent, planned, { parentId, ctx } = {}) {
  const rule = ruleOf(parent);
  if (!rule || !(rule.params.child in planned)) return undefined;
  const child = store.registry.bySlug.get(`${parent.slug}/${rule.params.child}`);
  const stored = parentId === undefined ? [] : rowsOf(store, tenantId, child).filter(ownRows(child, parentId));
  const found = checkOps(stored, planned[rule.params.child], { entity: rule.params.entity, child: rule.params.child, today: todayIso() });
  if (found && 'invalid' in found) throw validationError([found.invalid]);
  if (found && 'conflict' in found) throw actionNotAllowed(found.conflict);
  return (id) => settle(store, tenantId, parent, child, id, ctx);
}

/** The first of the given values that was sent. @param {unknown[]} values */
const sent = (...values) => values.find((value) => value !== undefined && value !== null);

/** What an action hook works on: the rule's words, the history child and the live rows of the master. @param {any} store @param {string} tenantId @param {any} entry @param {any} master */
function historyOf(store, tenantId, entry, master) {
  const { entity, child: name } = ruleOf(entry).params;
  const child = store.registry.bySlug.get(`${entry.slug}/${name}`);
  return { entity, child, rows: rowsOf(store, tenantId, child).filter(ownRows(child, master[entry.idKey])) };
}

const required = (/** @type {string} */ field) => validationError([{ field, code: 'REQUIRED', message: MOTIVO_REQUERIDO }]);

/**
 * Server action `activarAnexo` (S-MOCK-47, S-MOCK-48): adds an active row `{ fecha_inicio | f_inicio, motivo | motivo_activacion }`. Refused with
 * `{Entidad} ya Esta Activado` while the last row is active; a blank motivo is a 422 `Ingrese Motivo`; the start defaults to today.
 * @param {{ store: any, tenantId: string, entry: any, row: any, input: Record<string, any>, ctx?: import('./context.js').RequestContext }} call
 */
export function activarAnexo({ store, tenantId, entry, row, input, ctx }) {
  const { entity, child, rows } = historyOf(store, tenantId, entry, row);
  if (lastIsActive(rows)) throw actionNotAllowed(`${entity} ya Esta Activado`);
  const given = { f_inicio: sent(input.f_inicio, input.fecha_inicio), motivo_activacion: sent(input.motivo_activacion, input.motivo) };
  const picked = pickWritable(child, Object.fromEntries(Object.entries(given).filter(([, value]) => value !== undefined)));
  const record = withRuleDerived(child, blankHidden(child, withDefaults(child, picked, store.data(tenantId).params)));
  validateRecord(store, tenantId, child, record, { ctx, mode: 'INSERT', parentId: row[entry.idKey] });
  if (String(record.motivo_activacion ?? '').trim() === '') throw required('motivo_activacion');
  insertRow(store, tenantId, child, row[entry.idKey], record, ctx);
  settle(store, tenantId, entry, child, row[entry.idKey], ctx);
  return { message: `${entity} Activado` };
}

/**
 * Server action `desactivarAnexo` (S-MOCK-49): closes the active row (or the one named by `id`) with `{ fecha_fin | f_fin, motivo | motivo_desactivacion }`.
 * A fecha fin before the start is a 422 on `fecha_fin`; a blank motivo `Ingrese Motivo`; no active row `Registro ya esta Desactivado`.
 * @param {{ store: any, tenantId: string, entry: any, row: any, input: Record<string, any>, ctx?: import('./context.js').RequestContext }} call
 */
export function desactivarAnexo({ store, tenantId, entry, row, input, ctx }) {
  const { entity, child, rows } = historyOf(store, tenantId, entry, row);
  const named = input.id === undefined ? undefined : rows.find((/** @type {any} */ r) => r[child.idKey] === String(input.id));
  if (input.id !== undefined && !named) throw notFound(`${child.slug} ${input.id} not found`);
  const target = named ?? [...rows].reverse().find(isActive);
  if (!target || !isActive(target)) throw actionNotAllowed('Registro ya esta Desactivado');
  const fin = sent(input.f_fin, input.fecha_fin) ?? todayIso();
  if (!isIsoDate(fin)) throw validationError([{ field: 'fecha_fin', code: 'DATE', message: 'fecha_fin must be a valid date' }]);
  if (String(fin) < String(target.f_inicio)) throw validationError([{ field: 'fecha_fin', code: 'RANGE', message: FECHA_MENOR }]);
  const { motivo_desactivacion: motivo = '' } = pickWritable(child, { motivo_desactivacion: String(sent(input.motivo_desactivacion, input.motivo) ?? '') });
  if (motivo === '') throw required('motivo_desactivacion');
  Object.assign(target, { estado: 'D', f_fin: String(fin), motivo_desactivacion: motivo, ...stampsOf(store, tenantId, child, ctx) });
  settle(store, tenantId, entry, child, row[entry.idKey], ctx);
  return { message: `${entity} Desactivado` };
}
