// Layer: Impl. Filters, paging, selection, keyboard and veto of the lookup dialog; a response for a superseded state is dropped.
import { useEffect, useRef, useState, type RefObject } from 'react';
import { fieldsToClear } from '../../dependentChain';
import { useGuardedClose } from '../../../views/uishell/DialogStackProvider';
import { LOOKUPDIALOG_DEFAULTS, type InterLookupDialog } from './InterLookupDialog';

type Row = Record<string, string>;
type Load = { status: 'loading' } | { status: 'failed' } | { status: 'ready'; rows: Row[]; total: number };

export type LookupDialogViewProps = typeof LOOKUPDIALOG_DEFAULTS & {
  config: InterLookupDialog['config'];
  idKey: string;
  load: Load;
  filters: Record<string, string>;
  extras: Record<string, string>;
  selectedId?: string;
  page: number;
  pageCount: number;
  vetoMessage?: string;
  loadOptions: InterLookupDialog['loadOptions'];
  gridRef: RefObject<HTMLDivElement>;
  cancelRef: RefObject<HTMLButtonElement>;
  registerFilter: (index: number) => (element: HTMLElement | null) => void;
  onFilterChange: (field: string, value: string) => void;
  onFilterEnter: (index: number) => void;
  onExtraChange: (name: string, value: string) => void;
  onExtraBlur: (name: string) => void;
  onRowSelect: (id: string) => void;
  onRowOpen: (id: string) => void;
  onGridEnter: () => void;
  onPageChange: (page: number) => void;
  onPick: () => void;
  onRefresh: () => void;
  onRetry: () => void;
  onClose: () => void;
};

const compact = (filters: Record<string, string>) => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));

export function useLookupDialogImpl(props: InterLookupDialog): LookupDialogViewProps {
  const { config, idKey, list, preset, veto, onPick, onClose, loadOptions } = props;
  const resolved = { ...LOOKUPDIALOG_DEFAULTS, ...props };
  const defaults = Object.fromEntries((config.extras ?? []).map((extra) => [extra.name, extra.default]));
  const [filters, setFilters] = useState<Record<string, string>>({ ...preset });
  const [extras, setExtras] = useState<Record<string, string>>(defaults);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [vetoMessage, setVetoMessage] = useState<string | undefined>();
  const token = useRef(0);
  const selectFirst = useRef(false);
  const listRef = useRef(list);
  listRef.current = list;
  const filterEls = useRef<(HTMLElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const guardedClose = useGuardedClose(true, onClose);
  const sent = JSON.stringify(compact(filters));

  useEffect(() => {
    const mine = ++token.current;
    setLoad({ status: 'loading' });
    listRef.current({ filters: JSON.parse(sent), page, pageSize: resolved.pageSize }).then(
      ({ items, pagination }) => {
        if (mine !== token.current) return;
        setLoad({ status: 'ready', rows: items, total: pagination.total });
        // A filter change selects the first result (desktop behavior); the first load and a page change select none.
        setSelectedId(selectFirst.current && items.length > 0 ? String(items[0][idKey]) : undefined);
        selectFirst.current = false;
      },
      () => mine === token.current && setLoad({ status: 'failed' }),
    );
    // `sent` captures the filters; the page size and the id key are static per dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sent, page, reload]);

  const rows = load.status === 'ready' ? load.rows : [];
  const pick = (row?: Row) => {
    if (!row) return;
    const message = veto?.(row);
    setVetoMessage(message);
    if (message) return;
    onPick(row, extras);
    onClose();
  };
  const selectedRow = rows.find((row) => String(row[idKey]) === selectedId);
  const chain = config.filters.flatMap((f) => (f.type === 'select' && f.dependsOn ? [{ name: f.field, parents: [f.dependsOn] }] : []));

  return {
    ...resolved, config, idKey, load, filters, extras, selectedId, page, loadOptions, gridRef, cancelRef, vetoMessage,
    pageCount: Math.max(1, Math.ceil((load.status === 'ready' ? load.total : 0) / resolved.pageSize)),
    registerFilter: (index) => (element) => {
      filterEls.current[index] = element;
    },
    onFilterChange: (field, value) => {
      const cleared = fieldsToClear(chain, field);
      setFilters((current) => ({ ...current, ...Object.fromEntries(cleared.map((name) => [name, ''])), [field]: value }));
      setPage(1);
      selectFirst.current = true;
    },
    // Enter moves to the next filter; from the last one to the first result row, or to Cancelar when there are none.
    onFilterEnter: (index) => (filterEls.current[index + 1] ?? (rows.length > 0 ? gridRef.current : cancelRef.current))?.focus(),
    onExtraChange: (name, value) => setExtras((current) => ({ ...current, [name]: value })),
    onExtraBlur: (name) => setExtras((current) => (current[name]?.trim() === '' ? { ...current, [name]: defaults[name] } : current)),
    onRowSelect: setSelectedId,
    onRowOpen: (id) => pick(rows.find((row) => String(row[idKey]) === id)),
    onGridEnter: () => pick(selectedRow),
    onPageChange: setPage,
    onPick: () => pick(selectedRow),
    onRefresh: () => {
      setFilters({});
      setExtras(defaults);
      setPage(1);
      setReload((n) => n + 1);
    },
    onRetry: () => setReload((n) => n + 1),
    onClose: guardedClose,
  };
}
