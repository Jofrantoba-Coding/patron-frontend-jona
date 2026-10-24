// Layer: Implementation. The pending child changes of one open master register: one op list per child, shown over the persisted rows (R-MD-4).
import { useRef, useState } from 'react';
import { isActiveSibling } from '../../../mock-server/core/unique.js';

export type ChildRow = Record<string, any>;
/** A grid row: the stored or pending columns, a state (`A` / `D`) and a key that is unique within the grid. */
export type DraftRow = ChildRow & { _key: string; estado: string };
interface PendingOp {
  key: string;
  op: 'I';
  row: ChildRow;
}

export function useChildDraftsImpl(names: readonly string[]) {
  const [persisted, setPersisted] = useState<Record<string, ChildRow[]>>({});
  const [pending, setPending] = useState<Record<string, PendingOp[]>>({});
  const counter = useRef(0);

  // A logically deleted row never shows (R-MD-2); a deactivated one stays as history.
  const rows = (name: string): DraftRow[] => [
    ...(persisted[name] ?? []).filter((row) => row.activo !== false).map((row) => ({ ...row, _key: String(row.id), estado: row.estado ?? 'A' })),
    ...(pending[name] ?? []).map(({ key, row }) => ({ ...row, _key: key, estado: 'A' })),
  ];
  const withOps = names.filter((name) => (pending[name]?.length ?? 0) > 0);

  return {
    rows,
    siblings: (name: string) => rows(name).filter(isActiveSibling),
    load: (loaded: Record<string, ChildRow[]>) => setPersisted(loaded),
    add: (name: string, row: ChildRow) => setPending((current) => ({ ...current, [name]: [...(current[name] ?? []), { key: `~${++counter.current}`, op: 'I', row }] })),
    dirty: () => withOps.length > 0,
    /** The composite body (R-MOCK-19): only the changed rows, in the order they were made. */
    payload: () => (withOps.length === 0 ? {} : { children: Object.fromEntries(withOps.map((name) => [name, pending[name].map(({ op, row }) => ({ op, ...row }))])) }),
  };
}
