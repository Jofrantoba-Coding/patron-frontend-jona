// Layer: Implementation. Fetch, client-side view state and selection of the generic crud list.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CatalogConfig, CrudAction } from '../../catalogs/CatalogConfig';
import { nextSort } from '../../domain/crud/filterSort';
import { applyListView, isTruncated, pageOfRow, withListViewChange, type ListViewState } from '../../domain/crud/listView';
import type { Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { toFailure } from '../uilogin/UiLoginImpl';
import type { InterUiCrudList } from './InterUiCrudList';

/** W1 catalogs are small: one fetch brings them all and the client filters, sorts and pages. */
const FETCH_ALL = { page: 1, pageSize: 1000 };

type Load<T> =
  | { status: 'loading' }
  | { status: 'ready'; items: T[]; truncated: boolean }
  | { status: 'failed'; message: string; traceId?: string };

export interface CrudListHandlers {
  /** Every toolbar action but `refresh`, which the list runs itself. */
  onAction?: (action: CrudAction) => void;
  /** Double click on a row. */
  onRowOpen?: (id: string) => void;
}

export function useUiCrudListImpl<T>(
  config: CatalogConfig<T>,
  service: InterCatalogService<T>,
  permissions: Permissions,
  { onAction, onRowOpen }: CrudListHandlers = {},
): InterUiCrudList<T> {
  const [load, setLoad] = useState<Load<T>>({ status: 'loading' });
  const [view, setView] = useState<ListViewState>({ filterText: '', page: 1 });
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const latest = useRef(0);
  const filterKeys = useMemo(() => config.columns.map((column) => column.key), [config.columns]);

  const refresh = useCallback(
    async ({ select }: { select?: string } = {}) => {
      const request = ++latest.current;
      setLoad({ status: 'loading' });
      try {
        const { items, pagination } = await service.list(FETCH_ALL);
        if (request !== latest.current) return;
        setLoad({ status: 'ready', items, truncated: isTruncated(pagination, items.length) });
        setSelectedId((current) => select ?? (items.some((row) => String(row[config.idKey]) === current) ? current : undefined));
        if (select !== undefined) {
          setView((state) => ({ ...state, page: pageOfRow(items, state, filterKeys, config.idKey, select) ?? state.page }));
        }
      } catch (error) {
        if (request === latest.current) setLoad({ status: 'failed', ...toFailure(error) });
      }
    },
    [service, config.idKey, filterKeys],
  );

  useEffect(() => {
    void refresh();
    return () => {
      latest.current++;
    };
  }, [refresh]);

  const items = load.status === 'ready' ? load.items : [];
  const { rows, page, pageCount, matchCount } = applyListView(items, view, filterKeys);

  return {
    title: config.title,
    status: load.status,
    errorMessage: load.status === 'failed' ? load.message : undefined,
    errorTraceId: load.status === 'failed' ? load.traceId : undefined,
    truncated: load.status === 'ready' && load.truncated,
    columns: config.columns,
    idKey: config.idKey,
    actions: config.actions,
    permissions,
    filterText: view.filterText,
    sort: view.sort,
    rows,
    page,
    pageCount,
    matchCount,
    selectedId,
    onFilterChange: (filterText) => setView((state) => withListViewChange(state, { filterText })),
    onSortChange: (key) => setView((state) => withListViewChange(state, { sort: nextSort(state.sort, key) })),
    onPageChange: (next) => setView((state) => withListViewChange(state, { page: next })),
    onRowSelect: setSelectedId,
    onRowOpen: (id) => {
      setSelectedId(id);
      onRowOpen?.(id);
    },
    onAction: (action) => (action === 'refresh' ? void refresh() : onAction?.(action)),
    onRetry: () => void refresh(),
    refresh,
  };
}
