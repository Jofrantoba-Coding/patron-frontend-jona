import { DataTableColumn, DataTableSort } from './InterDataTableMolecule';
interface DataTableMoleculeViewProps<T> {
    columns: DataTableColumn<T>[];
    rows: T[];
    rowKey: (row: T, index: number) => string;
    sort?: DataTableSort;
    loading: boolean;
    emptyTitle: string;
    emptyDescription: string;
    filterValue: string;
    filterPlaceholder: string;
    showFilter: boolean;
    stickyHeader: boolean;
    className?: string;
    onSortChange?: (sort: DataTableSort) => void;
    onFilterChange?: (value: string) => void;
    onRowClick?: (row: T, index: number) => void;
}
export declare function DataTableMoleculeView<T>({ columns, rows, rowKey, sort, loading, emptyTitle, emptyDescription, filterValue, filterPlaceholder, showFilter, stickyHeader, className, onSortChange, onFilterChange, onRowClick, }: DataTableMoleculeViewProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
