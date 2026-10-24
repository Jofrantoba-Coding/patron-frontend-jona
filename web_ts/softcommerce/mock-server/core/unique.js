/**
 * Pure uniqueness over a list of rows (R-MD-6, R-MOCK-21). The server (`validators.js`, the composite write) and the master register client import this
 * same module, so a duplicate is decided the same way on the grid before saving and on the server.
 */

/** Text comparison of two values: trimmed, `null` and `undefined` read as empty. @param {unknown} a @param {unknown} b */
export const same = (a, b) => String(a ?? '').trim() === String(b ?? '').trim();

/** A row that is not logically deleted. @param {Record<string, any>} row */
export const isActive = (row) => row.activo !== false;

/** An active sibling of a child grid: not logically deleted and not deactivated (`estado` `D`). @param {Record<string, any>} row */
export const isActiveSibling = (row) => row.activo !== false && row.estado !== 'D';

/**
 * The first row that holds the same values as `record` in every one of `fields`, among the rows `active` accepts and apart from the record itself.
 * @param {Record<string, any>[]} rows the candidates (already limited to the parent, the empresa and so on by the caller)
 * @param {string[]} fields @param {Record<string, any>} record
 * @param {{ selfId?: string, idKey?: string, active?: (row: Record<string, any>) => boolean }} [options] `idKey` defaults to `id`; `active` to {@link isActive}.
 */
export function findConflict(rows, fields, record, { selfId, idKey = 'id', active = isActive } = {}) {
  return rows.find((row) => active(row) && String(row[idKey]) !== selfId && fields.every((field) => same(row[field], record[field])));
}
