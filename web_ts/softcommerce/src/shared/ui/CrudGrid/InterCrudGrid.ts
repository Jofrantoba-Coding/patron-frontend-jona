// Layer: Interface. Public contract of the crud grid: shapes and defaults only, no logic.
import type { SortState } from '../../../domain/crud/filterSort';

export interface GridColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
}

export interface InterCrudGrid<T> {
  ariaLabel?: string;
  columns: GridColumn<T>[];
  /** The visible page, already filtered, sorted and cut. */
  rows: T[];
  idKey: keyof T & string;
  selectedId?: string;
  sort?: SortState<string>;
  /** 1-based. */
  page: number;
  pageCount: number;
  /** Callbacks are value-first: the row id or column key, no DOM event. */
  onRowSelect?: (id: string) => void;
  onRowOpen?: (id: string) => void;
  onSortChange?: (key: string) => void;
  onPageChange?: (page: number) => void;
}

/** Presentation defaults only; rows, selection and paging are state and never defaulted. */
export const CRUDGRID_DEFAULTS: Required<Pick<InterCrudGrid<unknown>, 'ariaLabel'>> = {
  ariaLabel: 'Registros',
};
