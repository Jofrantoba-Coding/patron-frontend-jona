import React from 'react';
export type JTableResponsiveMode = 'scroll' | 'cards' | 'none';
export type JTableSortDirection = 'asc' | 'desc' | null;
export interface JTableContextValue {
    responsiveMode: JTableResponsiveMode;
    labelsRef: React.MutableRefObject<string[]>;
    columnFilters: Record<number, string>;
    setColumnFilter: (columnIndex: number, value: string) => void;
}
export interface InterTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    columnIndex?: number;
    groupHeader?: boolean;
    sortable?: boolean;
    sortDirection?: JTableSortDirection;
    sortLabel?: string;
    sortCycle?: JTableSortDirection[];
    onSortChange?: (direction: JTableSortDirection) => void;
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
export interface JTablePaginationConfig {
    currentPage: number;
    pageSize: number;
    totalRows: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    showPageSizeSelector?: boolean;
    showRowsInfo?: boolean;
}
/** Column definition for the data-driven API. */
export interface JTableColumnDef<TData extends Record<string, unknown> = Record<string, unknown>> {
    key: string;
    header: string;
    sortable?: boolean;
    /** Controlled sort direction. If undefined, sort is managed internally by the table. */
    sortDirection?: JTableSortDirection;
    /** When provided, sort is controlled — caller is responsible for pre-sorting data. */
    onSortChange?: (direction: JTableSortDirection) => void;
    filterable?: boolean;
    filterPlaceholder?: string;
    /** Controlled filter value. If undefined, uncontrolled auto-filter via context is used. */
    filterValue?: string;
    /** When provided, filter is controlled — caller is responsible for pre-filtering data. */
    onFilterChange?: (value: string) => void;
    resizable?: boolean;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    align?: 'left' | 'center' | 'right';
    render?: (value: unknown, row: TData, rowIndex: number) => React.ReactNode;
}
/** A spanning group header containing child columns. */
export interface JTableColumnGroup<TData extends Record<string, unknown> = Record<string, unknown>> {
    label: string;
    columns: JTableColumnDef<TData>[];
}
/** Union of flat columns or grouped columns. */
export type JTableColumnsConfig<TData extends Record<string, unknown> = Record<string, unknown>> = JTableColumnDef<TData>[] | JTableColumnGroup<TData>[];
export interface InterJTable extends React.TableHTMLAttributes<HTMLTableElement> {
    responsiveMode?: JTableResponsiveMode;
    wrapperClassName?: string;
    pagination?: JTablePaginationConfig;
    /** Data-driven column definitions (flat or grouped). */
    columns?: JTableColumnsConfig;
    /** Row data for data-driven mode. */
    data?: Record<string, unknown>[];
    /** Optional caption rendered above the table. */
    caption?: string;
    /** Message shown when data is empty or fully filtered. */
    emptyMessage?: string;
}
export declare const JTABLE_DEFAULTS: Required<Pick<InterJTable, 'responsiveMode'>>;
