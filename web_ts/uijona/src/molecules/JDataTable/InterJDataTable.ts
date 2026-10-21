// InterJDataTable.ts — JONA Interface + defaults
import React from 'react';

export type JDataTableSortDirection = 'asc' | 'desc' | null;
/** 'scroll': horizontal scroll on narrow screens. 'cards': one card per row below md:. */
export type JDataTableResponsiveMode = 'scroll' | 'cards';

export interface JDataTableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Visual order inside the mobile card (lower first); does not affect the desktop table. */
  mobilePriority?: number;
  render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode;
}

export interface JDataTableSort {
  key: string;
  direction: JDataTableSortDirection;
}

export interface InterJDataTable<T = Record<string, unknown>> {
  columns: JDataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  sort?: JDataTableSort;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  filterValue?: string;
  filterPlaceholder?: string;
  showFilter?: boolean;
  stickyHeader?: boolean;
  responsiveMode?: JDataTableResponsiveMode;
  /** Label of the full-width row action shown on mobile cards (requires onRowClick). */
  mobileActionLabel?: string;
  className?: string;
  onSortChange?: (sort: JDataTableSort) => void;
  onFilterChange?: (value: string) => void;
  onRowClick?: (row: T, index: number) => void;
}

export const JDATA_TABLE_DEFAULTS: Required<Pick<InterJDataTable,
  'loading' | 'emptyTitle' | 'emptyDescription' | 'filterPlaceholder' | 'showFilter' | 'stickyHeader'
  | 'responsiveMode' | 'mobileActionLabel'
>> = {
  loading: false,
  emptyTitle: 'Sin datos',
  emptyDescription: 'No hay registros para mostrar.',
  filterPlaceholder: 'Buscar...',
  showFilter: false,
  stickyHeader: false,
  responsiveMode: 'scroll',
  mobileActionLabel: 'Ver detalle',
};
