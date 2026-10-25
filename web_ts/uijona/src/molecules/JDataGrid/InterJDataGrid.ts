// InterJDataGrid.ts — JONA Interface
import React from 'react';
import type { JBadgeVariant } from '../../atoms/JBadge/InterJBadge';

export type JDataGridSortDirection = 'asc' | 'desc';
export type JDataGridLoading = false | 'initial' | 'refresh';

export interface JDataGridColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  /** A CSS width for the column, for example `8rem`. */
  width?: string;
  sortable?: boolean;
  /** Without it the cell shows `row[key]` as text. */
  render?: (row: T) => React.ReactNode;
}

export interface JDataGridRowState {
  /** Shown in the row and exposed as its accessible description. */
  badge?: { label: string; variant: JBadgeVariant };
  /** Shown next to the row, linked through aria-describedby; marks the row invalid. */
  error?: string;
  muted?: boolean;
}

export interface InterJDataGrid<T> {
  ariaLabel: string;
  columns: JDataGridColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Controlled selection: the grid reports onSelect and shows the key it receives. */
  selectedKey?: string | null;
  loading?: JDataGridLoading;
  loadingLabel?: string;
  /** Rendered when there are no rows. */
  empty?: React.ReactNode;
  /** Caps the scroll area through a CSS variable (D4), for example `24rem`. */
  maxHeight?: string;
  sort?: { key: string; direction: JDataGridSortDirection };
  rowState?: (row: T) => JDataGridRowState;
  /** Observer events — value-first: the row key. */
  onSelect: (key: string) => void;
  onOpen: (key: string) => void;
  /** The column key and the next direction. */
  onSortChange?: (key: string, direction: JDataGridSortDirection) => void;
}

/** Imperative handle: focus a row (the tab-stop row when no key is given). */
export interface JDataGridHandle {
  focusRow: (key?: string) => void;
}

export const JDATAGRID_DEFAULTS = {
  loading: false,
  loadingLabel: 'Cargando...',
} as const satisfies Required<Pick<InterJDataGrid<unknown>, 'loading' | 'loadingLabel'>>;

/** PgUp / PgDn step, in rows (R-DAT-3). */
export const JDATAGRID_PAGE_STEP = 10;
