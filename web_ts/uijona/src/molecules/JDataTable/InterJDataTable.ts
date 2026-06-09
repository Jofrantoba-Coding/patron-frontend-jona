// InterJDataTable.ts — JONA Interface + defaults
import React from 'react';

export type JDataTableSortDirection = 'asc' | 'desc' | null;

export interface JDataTableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
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
  className?: string;
  onSortChange?: (sort: JDataTableSort) => void;
  onFilterChange?: (value: string) => void;
  onRowClick?: (row: T, index: number) => void;
}

export const JDATA_TABLE_DEFAULTS: Required<Pick<InterJDataTable,
  'loading' | 'emptyTitle' | 'emptyDescription' | 'filterPlaceholder' | 'showFilter' | 'stickyHeader'
>> = {
  loading: false,
  emptyTitle: 'Sin datos',
  emptyDescription: 'No hay registros para mostrar.',
  filterPlaceholder: 'Buscar...',
  showFilter: false,
  stickyHeader: false,
};
