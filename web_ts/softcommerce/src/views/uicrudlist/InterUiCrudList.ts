// Layer: Interface. Public contract of the generic crud list: shapes and defaults only, no logic.
import type { RefObject } from 'react';
import type { CrudAction } from '../../catalogs/CatalogConfig';
import type { SortState } from '../../domain/crud/filterSort';
import type { Permissions } from '../../domain/permissions';
import type { GridColumn } from '../../shared/ui/CrudGrid';

export type ListStatus = 'loading' | 'ready' | 'failed';

export interface InterUiCrudList<T> {
  title: string;
  filterLabel?: string;
  loadingLabel?: string;
  emptyLabel?: string;
  retryLabel?: string;
  truncatedLabel?: string;
  status: ListStatus;
  errorMessage?: string;
  /** Support reference of a server error. */
  errorTraceId?: string;
  /** True when the server holds more rows than the single fetch brought. */
  truncated: boolean;
  columns: GridColumn<T>[];
  idKey: keyof T & string;
  actions?: readonly CrudAction[];
  permissions: Permissions;
  filterText: string;
  sort?: SortState<string>;
  /** The visible page. */
  rows: T[];
  page: number;
  pageCount: number;
  /** Rows left after filtering. */
  matchCount: number;
  selectedId?: string;
  /** Callbacks are value-first: the business value, no DOM event. */
  onFilterChange: (text: string) => void;
  onSortChange: (key: string) => void;
  onPageChange: (page: number) => void;
  onRowSelect: (id: string) => void;
  onRowOpen: (id: string) => void;
  /** Gate-free: the toolbar already gates. `refresh` is handled here, the rest goes to the owner. */
  onAction: (action: CrudAction) => void;
  onRetry: () => void;
  /** The list's container: its toolbar shortcuts only listen inside it. */
  shortcutScope: RefObject<HTMLElement>;
  /** True while a dialog is open, so the list's shortcuts stay quiet. */
  shortcutsBlocked: () => boolean;
  /** Reloads the list; `select` re-selects that id and jumps to its page, else the selection stays while the row exists. */
  refresh: (options?: { select?: string }) => Promise<void>;
}

/** Presentation defaults only; rows, status and selection are state and never defaulted. */
export const UICRUDLIST_DEFAULTS: Required<
  Pick<InterUiCrudList<unknown>, 'filterLabel' | 'loadingLabel' | 'emptyLabel' | 'retryLabel' | 'truncatedLabel'>
> = {
  filterLabel: 'Filtro',
  loadingLabel: 'Cargando...',
  emptyLabel: 'No hay registros.',
  retryLabel: 'Reintentar',
  truncatedLabel: 'La lista está incompleta: se muestran solo los primeros registros.',
};
