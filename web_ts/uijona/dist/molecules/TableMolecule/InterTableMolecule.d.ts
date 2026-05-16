import { default as React } from '../../../node_modules/react';

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
/** Column definition for the data-driven API. */
export interface TableColumnDef<TData extends Record<string, unknown> = Record<string, unknown>> {
    key: string;
    header: string;
    sortable?: boolean;
    /** Controlled sort direction. If undefined, sort is managed internally by the table. */
    sortDirection?: TableSortDirection;
    /** When provided, sort is controlled — caller is responsible for pre-sorting data. */
    onSortChange?: (direction: TableSortDirection) => void;
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
export interface TableColumnGroup<TData extends Record<string, unknown> = Record<string, unknown>> {
    label: string;
    columns: TableColumnDef<TData>[];
}
/** Union of flat columns or grouped columns. */
export type TableColumnsConfig<TData extends Record<string, unknown> = Record<string, unknown>> = TableColumnDef<TData>[] | TableColumnGroup<TData>[];
export interface InterTableMolecule extends React.TableHTMLAttributes<HTMLTableElement> {
    responsiveMode?: TableResponsiveMode;
    wrapperClassName?: string;
    pagination?: TablePaginationConfig;
    /** Data-driven column definitions (flat or grouped). */
    columns?: TableColumnsConfig;
    /** Row data for data-driven mode. */
    data?: Record<string, unknown>[];
    /** Optional caption rendered above the table. */
    caption?: string;
    /** Message shown when data is empty or fully filtered. */
    emptyMessage?: string;
}
export declare const TABLE_MOLECULE_DEFAULTS: Required<Pick<InterTableMolecule, 'responsiveMode'>>;
