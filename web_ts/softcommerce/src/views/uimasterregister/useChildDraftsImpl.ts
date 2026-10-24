// Layer: Implementation. The pending child changes of one open master register: one op list per child, shown over the persisted rows (R-MD-4).
import { useRef, useState } from 'react';
import { isActiveSibling } from '../../../mock-server/core/unique.js';

export type ChildRow = Record<string, any>;
/** A grid row: the stored or pending columns, a state (`A` / `D`) and a key that is unique within the grid. */
export type DraftRow = ChildRow & { _key: string; estado: string };
/** `I` inserts a pending row, `A` changes or deactivates a persisted one (`patch` and/or the new `estado`), `E` deletes a persisted one (R-MOCK-19). */
interface PendingOp {
  key: string;
  op: 'I' | 'A' | 'E';
  row?: ChildRow;
  patch?: ChildRow;
  estado?: string;
}

export function useChildDraftsImpl(names: readonly string[], idKeys: Record<string, string> = {}) {
  const [persisted, setPersisted] = useState<Record<string, ChildRow[]>>({});
  const [pending, setPending] = useState<Record<string, PendingOp[]>>({});
  const counter = useRef(0);
  const keyOf = (name: string, row: ChildRow) => String(row[idKeys[name] ?? 'id']);
  const opOn = (name: string, key: string) => (pending[name] ?? []).find((change) => change.key === key && change.op !== 'I');

  // A logically deleted row never shows (R-MD-2); a deactivated one stays as history; a row queued for deletion has left the grid.
  const rows = (name: string): DraftRow[] => [
    ...(persisted[name] ?? [])
      .filter((row) => row.activo !== false && opOn(name, keyOf(name, row))?.op !== 'E')
      .map((row) => {
        const change = opOn(name, keyOf(name, row));
        return { ...row, ...change?.patch, _key: keyOf(name, row), estado: (change?.op === 'A' ? change.estado : undefined) ?? row.estado ?? 'A' };
      }),
    ...(pending[name] ?? []).flatMap(({ key, op, row }) => (op === 'I' ? [{ ...row, _key: key, estado: 'A' }] : [])),
  ];
  const withOps = names.filter((name) => (pending[name]?.length ?? 0) > 0);
  const push = (name: string, change: PendingOp) => setPending((current) => ({ ...current, [name]: [...(current[name] ?? []), change] }));
  /** Changes a persisted row: a second change merges into the row's op and keeps its place in the list, so the sent index stays stable. */
  const amend = (name: string, key: string, patch: ChildRow | undefined, estado: string | undefined) =>
    setPending((current) => {
      const list = current[name] ?? [];
      const merge = (op: PendingOp): PendingOp => ({ ...op, patch: { ...op.patch, ...patch }, ...((estado ?? op.estado) !== undefined && { estado: estado ?? op.estado }) });
      return {
        ...current,
        [name]: list.some((op) => op.key === key && op.op === 'A') ? list.map((op) => (op.key === key && op.op === 'A' ? merge(op) : op)) : [...list, merge({ key, op: 'A' })],
      };
    });

  return {
    rows,
    siblings: (name: string) => rows(name).filter(isActiveSibling),
    load: (loaded: Record<string, ChildRow[]>) => setPersisted(loaded),
    /** The server's rows of one child replace the persisted ones after an immediate action; the pending changes of the open register stay. */
    loadOne: (name: string, loaded: ChildRow[]) => setPersisted((current) => ({ ...current, [name]: loaded })),
    add: (name: string, row: ChildRow) => push(name, { key: `~${++counter.current}`, op: 'I', row }),
    /** A pending row disappears; a persisted one is deactivated or deleted by the child's removal kind (R-MD-4). */
    quitar: (name: string, key: string, kind: 'deactivate' | 'delete' | 'none') => {
      if (key.startsWith('~')) setPending((current) => ({ ...current, [name]: (current[name] ?? []).filter((change) => change.key !== key) }));
      else if (kind === 'delete') push(name, { key, op: 'E' });
      else if (kind === 'deactivate') amend(name, key, undefined, 'D');
    },
    /** A deferred action changes a row: a pending one in place, a persisted one through its op (R-ACT-4). `estado` is the new state, when the action gives one. */
    change: (name: string, key: string, patch: ChildRow, estado?: string) => {
      if (key.startsWith('~')) setPending((current) => ({ ...current, [name]: (current[name] ?? []).map((op) => (op.key === key ? { ...op, row: { ...op.row, ...patch } } : op)) }));
      else amend(name, key, patch, estado);
    },
    /** The key of the row the n-th op sent for the child belongs to (a server failure names it by that index). */
    opKey: (name: string, index: number) => pending[name]?.[index]?.key,
    dirty: () => withOps.length > 0,
    /** The composite body (R-MOCK-19): only the changed rows, in the order they were made. */
    payload: () =>
      withOps.length === 0
        ? {}
        : {
            children: Object.fromEntries(
              withOps.map((name) => [name, pending[name].map(({ key, op, row, patch, estado }) => (op === 'I' ? { op, ...row } : { op, id: key, ...patch, ...(op === 'A' && estado !== undefined ? { estado } : {}) }))]),
            ),
          },
  };
}
