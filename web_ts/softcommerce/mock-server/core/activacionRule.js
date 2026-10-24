/**
 * The pure part of the named rule `activacion` (R-ANX-3..5, D13): the activation history of an anexo master. It reads no store, so the server, the in-browser
 * mock and the tests share it. A row is `{ id, estado, f_inicio, f_fin, motivo_activacion, motivo_desactivacion }` with `estado` `A` or `D`; a row with no
 * `estado` (a legacy seed) counts as active, and a master with no row at all counts as active too (R-ANX-5, [ASSUMPTION]).
 *
 * Rules: at most ONE active row after a body is applied; a deactivation needs a motivo and a `f_fin` that is not before the row's `f_inicio` ([DEVIATION],
 * the desktop only said it for precios); the master `estado` is the state of the LAST row.
 */
export const FECHA_MENOR = 'Fecha es menor a fecha inicial';
export const MOTIVO_REQUERIDO = 'Ingrese Motivo';

/** The entry rule: it claims the master `estado`, so a body never writes it (R-ACT-5); the rule derives it from the history. */
export const activacion = {
  /** @param {{ estado?: string }} [params] */
  owns: (params) => [params?.estado ?? 'estado'],
};

/** @param {Record<string, any>} row */
export const isActive = (row) => row.estado !== 'D';

/** The master estado: the state of the last row; no rows is active. @param {Record<string, any>[]} rows */
export const lastIsActive = (rows) => rows.length === 0 || isActive(rows[rows.length - 1]);

/**
 * Replays the ops of a body over the stored rows of one parent, in the order sent: `I` appends an active row (id `~<n>`, `n` its index in the sent array),
 * `A` changes a row and `estado: 'D'` deactivates it (a row is never reactivated, R-MOCK-21), `E` removes it. Pure; the stored rows are not touched.
 * @param {Record<string, any>[]} stored @param {Record<string, any>[]} ops @param {string} today
 * @returns {Record<string, any>[]}
 */
export function applyOps(stored, ops, today) {
  /** @type {Record<string, any>[]} */
  let rows = stored.map((row) => ({ ...row }));
  ops.forEach((op, n) => {
    if (op.op === 'I') {
      rows.push({ id: `~${n}`, f_fin: '', ...op, f_inicio: op.f_inicio || today, estado: 'A', op: undefined });
    } else if (op.op === 'E') {
      rows = rows.filter((row) => row.id !== String(op.id));
    } else if (op.op === 'A') {
      const row = rows.find((candidate) => candidate.id === String(op.id));
      if (!row) return;
      const { op: _op, id: _id, estado, ...patch } = op;
      Object.assign(row, patch, estado === 'D' ? { estado: 'D' } : {});
    }
  });
  return rows;
}

/**
 * The first rule a body breaks over the stored rows of its parent, or null: `{ invalid }` is a 422 detail on the indexed field of the op, `{ conflict }` the
 * 409 message when the body would leave two active rows. Per-op checks come first, in op order.
 * @param {Record<string, any>[]} stored @param {Record<string, any>[]} ops
 * @param {{ entity: string, child: string, today: string }} context `entity` is the word of the messages (`Banco`), `child` the name of the history in the body
 * @returns {{ invalid: { field: string, code: string, message: string } } | { conflict: string } | null}
 */
export function checkOps(stored, ops, { entity, child, today }) {
  const rows = applyOps(stored, ops, today);
  for (const [n, op] of ops.entries()) {
    if (op.op !== 'A' || op.estado !== 'D') continue;
    const row = rows.find((candidate) => candidate.id === String(op.id));
    if (!row) continue;
    const at = (/** @type {string} */ field) => `${child}[${n}].${field}`;
    if (row.f_fin && String(row.f_fin) < String(row.f_inicio)) return { invalid: { field: at('f_fin'), code: 'RANGE', message: FECHA_MENOR } };
    if (String(row.motivo_desactivacion ?? '').trim() === '') return { invalid: { field: at('motivo_desactivacion'), code: 'REQUIRED', message: MOTIVO_REQUERIDO } };
  }
  return rows.filter(isActive).length > 1 ? { conflict: `${entity} ya Esta Activado` } : null;
}
