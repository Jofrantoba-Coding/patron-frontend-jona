/**
 * The pure part of the named rule `padron` (R-ANX-7, R-ANX-8): the padron history of Cliente and Proveedor (`FormAnexoPadron.verificarPadron`). It reads no store, so
 * the server, the in-browser mock and the client rules share it. A row is `{ id, id_padron, estado, f_inicio, f_fin }` with `estado` `A` or `D`.
 *
 * Padron ids: `01` EXCEPTUADO, `02` AG. RETENCION, `03` AG. PERCEPCION, `04` BUEN CONTRIBUYENTE. Rules: the same padron cannot be active twice; `01` excludes `02` and
 * `03`. [DEVIATION] the desktop compared `02` twice and never `03` (`getIdPadron().equals("02") || ... equals("02")`), so `03` is checked here too.
 */
export const YA_ACTIVADO = 'Padron ya se Encuentra Activado';
export const INCOMPATIBLE_PERCEPCION = 'Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion';
export const INCOMPATIBLE_EXCEPTUADO = 'Configuracion incompatible, Desactive Exceptuado';
export const PADRON_REQUERIDO = 'Seleccione Padron';

const EXCEPTUADO = '01';
const PERCEPCION_RETENCION = ['02', '03'];

/** The entry rule: it claims the master flags, so a body never writes them (R-ANX-8); the rule derives them from the rows. */
export const padron = {
  /** @param {{ flags: Record<string, string> }} params */
  owns: (params) => Object.values(params.flags),
};

/** @param {Record<string, any>} row */
export const isActive = (row) => row.estado !== 'D';

/**
 * The message that refuses activating `idPadron` over the rows, or undefined: the same padron already active first, then the incompatibility.
 * @param {Record<string, any>[]} rows @param {string} idPadron
 */
export function refusal(rows, idPadron) {
  const active = rows.filter(isActive).map((row) => String(row.id_padron));
  if (active.includes(idPadron)) return YA_ACTIVADO;
  if (idPadron === EXCEPTUADO) return active.some((id) => PERCEPCION_RETENCION.includes(id)) ? INCOMPATIBLE_PERCEPCION : undefined;
  return PERCEPCION_RETENCION.includes(idPadron) && active.includes(EXCEPTUADO) ? INCOMPATIBLE_EXCEPTUADO : undefined;
}

/**
 * Replays the ops of a body over the stored rows, in the order sent: `I` appends an active row (id `~<n>`), `A` changes a row and `estado: 'D'` closes it (a row is
 * never reactivated: a new activation is a new row, S-ANX-13), `E` removes it. Pure.
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
 * The first refusal of a body over the stored rows of its parent, or null: each insert is checked against the rows the earlier ops leave, so two inserts of one
 * padron in a body fail like two clicks of `Activar`. `{ conflict }` is the 409 message.
 * @param {Record<string, any>[]} stored @param {Record<string, any>[]} ops
 * @param {{ child: string, today?: string }} [_context]
 * @returns {{ conflict: string } | null}
 */
export function checkOps(stored, ops, _context) {
  for (const [n, op] of ops.entries()) {
    if (op.op !== 'I' || !op.id_padron) continue;
    const message = refusal(applyOps(stored, ops.slice(0, n), ''), String(op.id_padron));
    if (message) return { conflict: message };
  }
  return null;
}

/**
 * The master flags the rows say: a flag is on when a padron row of its id is active (R-ANX-8). `flags` maps a padron id to the field name.
 * @param {Record<string, any>[]} rows @param {Record<string, string>} flags
 * @returns {Record<string, boolean>}
 */
export function flagsOf(rows, flags) {
  const active = new Set(rows.filter(isActive).map((row) => String(row.id_padron)));
  return Object.fromEntries(Object.entries(flags).map(([id, name]) => [name, active.has(id)]));
}
