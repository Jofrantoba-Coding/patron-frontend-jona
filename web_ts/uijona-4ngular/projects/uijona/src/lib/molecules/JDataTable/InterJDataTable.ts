export type JDataTableSortDirection = 'asc' | 'desc' | null;
export type JDataTableRow = Record<string, unknown>;

export interface JDataTableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Devuelve el texto de celda (para markup rico, proyecta tu propio template). */
  render?: (value: unknown, row: JDataTableRow, rowIndex: number) => string;
}

export interface JDataTableSort {
  key: string;
  direction: JDataTableSortDirection;
}

/** Contrato publico de JDataTable. */
export interface InterJDataTable {
  columns: JDataTableColumn[];
  data: JDataTableRow[];
  rowKey: (row: JDataTableRow, index: number) => string;
  sort?: JDataTableSort;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  filterValue?: string;
  filterPlaceholder?: string;
  showFilter?: boolean;
  stickyHeader?: boolean;
}
