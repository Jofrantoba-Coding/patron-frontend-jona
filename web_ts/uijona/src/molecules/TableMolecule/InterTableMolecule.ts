import React from 'react';

export type TableResponsiveMode = 'scroll' | 'cards' | 'none';
export type TableSortDirection = 'asc' | 'desc' | null;

export interface TableContextValue {
  responsiveMode: TableResponsiveMode;
  labelsRef: React.MutableRefObject<string[]>;
  columnFilters: Record<number, string>;
  setColumnFilter: (columnIndex: number, value: string) => void;
}

export interface InterTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  columnIndex?: number;
  groupHeader?: boolean;
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  sortLabel?: string;
  sortCycle?: TableSortDirection[];
  onSortChange?: (direction: TableSortDirection) => void;
  filterable?: boolean;
  filterValue?: string;
  filterPlaceholder?: string;
  filterInputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>;
  onFilterChange?: (value: string) => void;
  resizable?: boolean;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  resizeHandleLabel?: string;
  onColumnResize?: (width: number) => void;
}

export interface TablePaginationConfig {
  currentPage: number;
  pageSize: number;
  totalRows: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  showRowsInfo?: boolean;
}

export interface InterTableMolecule extends React.TableHTMLAttributes<HTMLTableElement> {
  responsiveMode?: TableResponsiveMode;
  wrapperClassName?: string;
  pagination?: TablePaginationConfig;
}

export const TABLE_MOLECULE_DEFAULTS: Required<Pick<InterTableMolecule, 'responsiveMode'>> = {
  responsiveMode: 'scroll',
};
