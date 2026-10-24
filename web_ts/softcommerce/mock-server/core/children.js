import { activacionChildHook } from './activacion.js';
import { MockError, notFound, validationError } from './errors.js';
import { padronChildHook } from './padron.js';
import { scopeFilter, stampsOf } from './context.js';
import { gateOpen } from './predicates.js';
import { blankHidden, derivedValues, withDefaults, withRuleDerived } from './stored.js';
import { ACTIVE_KEY, pickWritable, rowsOf, validateRecord } from './validators.js';

/**
 * Children of an entry (R-MOCK-19, D5-D7). The read side resolves a nested route to its child entry and checks the parent once; the write side
 * plans a composite body (`children: { <child>: [{ id?, op, ...fields }] }`): everything is validated first, fail-first, and only then written.
 */

/** Ops of a composite body: insert, update (or deactivate), delete. */
const OPS = ['I', 'A', 'E'];

/**
 * Named child rules (`activacion`, `padron` in W3-15) run after the field validation and before the write (D6). A hook gets the parent entry, the ops planned
 * per child and `{ parentId, ctx, creating }`; it throws to refuse the body and may return a function that runs after the writes with the parent id.
 * @type {Record<string, (store: any, tenantId: string, parent: any, ops: Record<string, any[]>, options: { parentId?: string, ctx?: import('./context.js').RequestContext, creating: boolean }) => ((parentId: string) => void) | void>}
 */
export const CHILD_RULE_HOOKS = { activacion: activacionChildHook, padron: padronChildHook };

/**
 * The child entry of `parent/name`; an unknown parent, an unknown name or the reserved `actions` is a 404.
 * @param {any} store @param {string} parentSlug @param {string} name
 */
export function childEntryOf(store, parentSlug, name) {
  const parent = store.registry.bySlug.get(parentSlug);
  const child = parent && parent.parent === undefined ? store.registry.bySlug.get(`${parentSlug}/${name}`) : undefined;
  if (!child || child.parent !== parentSlug) throw notFound(`Unknown child "${name}" of ${parentSlug}`);
  return child;
}

/**
 * The child entry of a nested route for a tenant: a child whose company-parameter gate is off does not exist (404, R-REG-17).
 * @param {any} store @param {string} tenantId @param {string} parentSlug @param {string} name
 */
export function gatedChildOf(store, tenantId, parentSlug, name) {
  const child = childEntryOf(store, parentSlug, name);
  if (!gateOpen(child.gate, store.data(tenantId).params)) throw notFound(`Unknown child "${name}" of ${parentSlug}`);
  return child;
}

/**
 * The parent row of a nested route: it must exist in the tenant and the session scope, and not be logically deleted.
 * @param {any} store @param {string} tenantId @param {any} child @param {string} id @param {import('./context.js').RequestContext} [ctx]
 */
export function liveParent(store, tenantId, child, id, ctx) {
  const parent = store.registry.bySlug.get(child.parent);
  const inScope = scopeFilter(store, tenantId, parent, ctx);
  const row = rowsOf(store, tenantId, parent).find((/** @type {any} */ r) => r[parent.idKey] === id && inScope(r));
  if (!row || row[ACTIVE_KEY] === false) throw notFound(`${parent.slug} ${id} not found`);
  return row;
}

/**
 * Cascade of a logical parent delete (R-MOCK-21, R-MD-7): every row of every child of `parent` linked to the deleted row is logically deleted, the
 * deactivated ones included. A store child marks the rows of the owning section; the rows of another parent are not touched.
 * @param {any} store @param {string} tenantId @param {any} parent @param {Record<string, any>} row the deleted parent row
 */
export function cascadeDelete(store, tenantId, parent, row) {
  for (const child of store.registry.childEntries.filter((/** @type {any} */ c) => c.parent === parent.slug)) {
    const sameEmpresa = (/** @type {any} */ r) => child.scope !== 'empresa' || parent.scope !== 'empresa' || String(r.id_empresa) === String(row.id_empresa);
    for (const kid of rowsOf(store, tenantId, child)) {
      if (String(kid[child.parentKey]) === String(row[parent.idKey]) && sameEmpresa(kid)) kid[ACTIVE_KEY] = false;
    }
  }
}

/** The write that stores one new child row under the parent id it is given. @param {any} child @param {any[]} rows @param {Record<string, any>} record @param {Record<string, any>} stamps */
const insertion = (child, rows, record, stamps) => (/** @type {string} */ id) => {
  const next = rows.reduce((/** @type {number} */ max, /** @type {any} */ r) => Math.max(max, Number(r[child.idKey]) || 0), 0) + 1;
  rows.push({ [child.idKey]: String(next).padStart(child.codeWidth, '0'), ...record, ...child.constants, ...derivedValues(child, record), ...stamps, [child.parentKey]: id, [ACTIVE_KEY]: true });
};

/** Re-roots a child failure on `<child>[<n>].<field>`, `n` being the index in the SENT array (S-MOCK-57). @param {unknown} error @param {string} name @param {number} n */
function indexed(error, name, n) {
  if (!(error instanceof MockError) || error.details.length === 0) return error;
  return new MockError(error.status, error.code, error.message, error.details.map((d) => ({ ...d, field: `${name}[${n}].${d.field}` })));
}

/**
 * Validates a composite body and returns the write to run once the parent is stored, or null when the body carries no children. Order (D6):
 * a child whose company-parameter gate is off is ignored (R-REG-17); child by child in declared order, op by op in sent order; the first failure stops (fail-first, W2 D10); then the named rules; nothing is written here.
 * @param {any} store @param {string} tenantId @param {any} parent @param {unknown} body
 * @param {{ ctx?: import('./context.js').RequestContext, parentId?: string, creating?: boolean }} [options] `parentId` is the stored parent on update; `creating`
 * adds the `initial` row of each child the body does not insert into (CLONE sends no child ops, R-MD-9).
 * @returns {{ apply: (parentId: string) => void } | null}
 */
export function planChildren(store, tenantId, parent, body, { ctx, parentId, creating = false } = {}) {
  if ((body === undefined || body === null) && !creating) return null;
  if (parent.children === undefined) return null;
  if (body !== undefined && body !== null && (typeof body !== 'object' || Array.isArray(body))) throw validationError([{ field: 'children', code: 'INVALID', message: 'children must be an object' }]);
  const params = store.data(tenantId).params;
  const sent = body ?? {};
  const names = Object.keys(sent);
  const unknown = names.find((name) => !store.registry.bySlug.has(`${parent.slug}/${name}`));
  if (unknown) throw validationError([{ field: `children.${unknown}`, code: 'UNKNOWN_CHILD', message: `Unknown child ${unknown}` }]);
  /** @type {((id: string) => void)[]} */
  const writes = [];
  /** @type {Record<string, any[]>} */
  const planned = {};
  for (const child of store.registry.childEntries.filter((/** @type {any} */ c) => c.parent === parent.slug && (names.includes(c.childName) || (creating && c.initial !== undefined)) && gateOpen(c.gate, params))) {
    const ops = /** @type {any} */ (sent)[child.childName] ?? [];
    if (!Array.isArray(ops)) throw validationError([{ field: child.childName, code: 'INVALID', message: `${child.childName} must be a list of operations` }]);
    const rows = rowsOf(store, tenantId, child);
    const own = (/** @type {any} */ r) => parentId !== undefined && String(r[child.parentKey]) === parentId && r[ACTIVE_KEY] !== false;
    planned[child.childName] = ops;
    // The working view of the active siblings: the stored rows of this parent, then every op planned before the current one (R-MD-6).
    const view = rows.filter(own).map((/** @type {any} */ r) => ({ ...r }));
    const inView = (/** @type {string} */ id) => view.find((/** @type {any} */ r) => r[child.idKey] === id);
    ops.forEach((/** @type {any} */ op, /** @type {number} */ n) => {
      const bad = (/** @type {string} */ field, /** @type {string} */ code, /** @type {string} */ message) => validationError([{ field: `${child.childName}[${n}].${field}`, code, message }]);
      if (!OPS.includes(op?.op)) throw bad('op', 'INVALID', 'op must be I, A or E');
      const stamps = stampsOf(store, tenantId, child, ctx);
      const stored = op.op === 'I' ? undefined : rows.find((/** @type {any} */ r) => own(r) && r[child.idKey] === String(op.id ?? ''));
      if (op.op !== 'I' && !stored) throw bad('id', 'NOT_FOUND', `${child.childName} ${op.id} does not exist`);
      if (op.op === 'E') {
        writes.push(() => { /** @type {any} */ (stored)[ACTIVE_KEY] = false; });
        view.splice(view.indexOf(/** @type {any} */ (inView(stored[child.idKey]))), 1);
        return;
      }
      const picked = pickWritable(child, op);
      const record = withRuleDerived(child, blankHidden(child, op.op === 'I' ? withDefaults(child, picked, params) : { ...stored, ...picked }));
      try {
        validateRecord(store, tenantId, child, record, { ctx, mode: op.op === 'I' ? 'INSERT' : 'UPDATE', selfId: stored?.[child.idKey], parentId, siblings: view });
      } catch (error) {
        throw indexed(error, child.childName, n);
      }
      if (op.op === 'A') {
        // `A` updates, and deactivates a child that is not removed by deletion (`deactivate`, or `none`: the activation history closes its rows); it never reactivates (R-MOCK-21).
        const estado = child.removal !== 'delete' && op.estado === 'D' ? { estado: 'D' } : {};
        writes.push(() => Object.assign(/** @type {any} */ (stored), record, derivedValues(child, record), stamps, estado));
        Object.assign(/** @type {any} */ (inView(stored[child.idKey])), record, estado);
        return;
      }
      view.push({ ...record, ...child.constants, [child.idKey]: `~${n}` });
      writes.push(insertion(child, rows, record, stamps));
    });
    // The server owns the first row of a child that declares one (the INICIO activation), whether or not the client sent it.
    if (creating && child.initial !== undefined && !ops.some((/** @type {any} */ op) => op?.op === 'I')) {
      writes.push(insertion(child, rows, withRuleDerived(child, blankHidden(child, withDefaults(child, { ...child.initial }, params))), stampsOf(store, tenantId, child, ctx)));
    }
  }
  // A rule may also settle what depends on the history once the rows are written (the master `estado`, the INICIO row of a legacy master).
  const settles = Object.values(CHILD_RULE_HOOKS).flatMap((hook) => hook(store, tenantId, parent, planned, { parentId, ctx, creating }) ?? []);
  return { apply: (id) => [...writes, ...settles].forEach((write) => write(id)) };
}
