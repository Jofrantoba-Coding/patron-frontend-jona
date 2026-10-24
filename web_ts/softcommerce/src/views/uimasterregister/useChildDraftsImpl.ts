// Layer: Implementation. The pending child changes of one open master register: one op list per child, shown over the persisted rows (R-MD-4).
import { useRef, useState } from 'react';
import { isActiveSibling } from '../../../mock-server/core/unique.js';

export type ChildRow = Record<string, any>;
/** A grid row: the stored or pending columns, a state (`A` / `D`) and a key that is unique within the grid. */
export type DraftRow = ChildRow & { _key: string; estado: string };
/** `I` inserts a pending row, `A` deactivates a persisted one, `E` deletes a persisted one (R-MOCK-19). */
interface PendingOp {
  key: string;
  op: 'I' | 'A' | 'E';
  row?: ChildRow;
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
      .map((row) => ({ ...row, _key: keyOf(name, row), estado: opOn(name, keyOf(name, row))?.op === 'A' ? 'D' : (row.estado ?? 'A') })),
    ...(pending[name] ?? []).flatMap(({ key, op, row }) => (op === 'I' ? [{ ...row, _key: key, estado: 'A' }] : [])),
  ];
  const withOps = names.filter((name) => (pending[name]?.length ?? 0) > 0);
  const push = (name: string, change: PendingOp) => setPending((current) => ({ ...current, [name]: [...(current[name] ?? []), change] }));

  return {
    rows,
    siblings: (name: string) => rows(name).filter(isActiveSibling),
    load: (loaded: Record<string, ChildRow[]>) => setPersisted(loaded),
    add: (name: string, row: ChildRow) => push(name, { key: `~${++counter.current}`, op: 'I', row }),
    /** A pending row disappears; a persisted one is deactivated or deleted by the child's removal kind (R-MD-4). */
    quitar: (name: string, key: string, kind: 'deactivate' | 'delete' | 'none') => {
      if (key.startsWith('~')) setPending((current) => ({ ...current, [name]: (current[name] ?? []).filter((change) => change.key !== key) }));
      else if (kind !== 'none') push(name, { key, op: kind === 'delete' ? 'E' : 'A' });
    },
    dirty: () => withOps.length > 0,
    /** The composite body (R-MOCK-19): only the changed rows, in the order they were made. */
    payload: () =>
      withOps.length === 0
        ? {}
        : {
            children: Object.fromEntries(
              withOps.map((name) => [name, pending[name].map(({ key, op, row }) => (op === 'I' ? { op, ...row } : { op, id: key, ...(op === 'A' ? { estado: 'D' } : {}) }))]),
            ),
          },
  };
}
