import { default as React } from '../../../node_modules/react';

export type SortDirection = 'asc' | 'desc' | null;
export interface DataTableColumn<T = Record<string, unknown>> {
    key: string;
    header: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode;
}
export interface DataTableSort {
    key: string;
    direction: SortDirection;
}
export interface InterDataTableMolecule<T = Record<string, unknown>> {
    columns: DataTableColumn<T>[];
    data: T[];
    rowKey: (row: T, index: number) => string;
    sort?: DataTableSort;
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    filterValue?: string;
    filterPlaceholder?: string;
    showFilter?: boolean;
    stickyHeader?: boolean;
    className?: string;
    onSortChange?: (sort: DataTableSort) => void;
    onFilterChange?: (value: string) => void;
    onRowClick?: (row: T, index: number) => void;
}
export declare const DATA_TABLE_MOLECULE_DEFAULTS: Required<Pick<InterDataTableMolecule, 'loading' | 'emptyTitle' | 'emptyDescription' | 'filterPlaceholder' | 'showFilter' | 'stickyHeader'>>;
