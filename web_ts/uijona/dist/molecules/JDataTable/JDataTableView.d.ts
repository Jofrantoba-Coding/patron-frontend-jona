import { JDataTableColumn, JDataTableSort } from './InterJDataTable';
interface JDataTableViewProps<T> {
    columns: JDataTableColumn<T>[];
    rows: T[];
    rowKey: (row: T, index: number) => string;
    sort?: JDataTableSort;
    loading: boolean;
    emptyTitle: string;
    emptyDescription: string;
    filterValue: string;
    filterPlaceholder: string;
    showFilter: boolean;
    stickyHeader: boolean;
    className?: string;
    onSortChange?: (sort: JDataTableSort) => void;
    onFilterChange?: (value: string) => void;
    onRowClick?: (row: T, index: number) => void;
}
export declare function JDataTableView<T>({ columns, rows, rowKey, sort, loading, emptyTitle, emptyDescription, filterValue, filterPlaceholder, showFilter, stickyHeader, className, onSortChange, onFilterChange, onRowClick, }: JDataTableViewProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
