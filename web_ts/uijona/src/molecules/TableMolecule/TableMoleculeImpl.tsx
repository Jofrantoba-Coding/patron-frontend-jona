import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import {
  InterTableMolecule,
  TABLE_MOLECULE_DEFAULTS,
  TableColumnDef,
  TableColumnGroup,
  TableColumnsConfig,
  TableSortDirection,
} from './InterTableMolecule';
import { TableContext, useTableContext } from './TableMoleculeContext';
import {
  TableMoleculeView,
  TableCaptionView,
  TableHeaderView,
  TableBodyView,
  TableFooterView,
  TableRowView,
  TableHeadView,
  TableCellView,
} from './TableMoleculeView';

// ─── Data-driven helpers ───────────────────────────────────────────────────────

function isColumnGroup(col: TableColumnDef | TableColumnGroup): col is TableColumnGroup {
  return 'columns' in col && Array.isArray((col as TableColumnGroup).columns);
}

function getLeafColumns(columns: TableColumnsConfig): TableColumnDef[] {
  if (columns.length === 0) return [];
  return isColumnGroup(columns[0] as TableColumnDef | TableColumnGroup)
    ? (columns as TableColumnGroup[]).flatMap((g) => g.columns)
    : (columns as TableColumnDef[]);
}

function sortDataByKey(
  data: Record<string, unknown>[],
  key: string,
  direction: TableSortDirection
): Record<string, unknown>[] {
  if (!direction) return data;
  return [...data].sort((a, b) => {
    const r = String(a[key] ?? '').localeCompare(String(b[key] ?? ''));
    return direction === 'asc' ? r : -r;
  });
}

const alignClass: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// ─── TableMoleculeImpl ────────────────────────────────────────────────────────

export const TableMoleculeImpl = forwardRef<HTMLTableElement, InterTableMolecule>(
  ({
    children,
    responsiveMode = TABLE_MOLECULE_DEFAULTS.responsiveMode,
    wrapperClassName,
    pagination,
    columns,
    data,
    caption,
    emptyMessage = 'Sin resultados',
    ...props
  }, ref) => {
    const labelsRef = useRef<string[]>([]);
    const [columnFilters, setColumnFilters] = useState<Record<number, string>>({});

    const setColumnFilter = useCallback((columnIndex: number, value: string) => {
      setColumnFilters((current) => {
        if ((current[columnIndex] ?? '') === value) return current;
        if (!value) {
          const next = { ...current };
          delete next[columnIndex];
          return next;
        }
        return { ...current, [columnIndex]: value };
      });
    }, []);

    const contextValue = useMemo(
      () => ({ responsiveMode, labelsRef, columnFilters, setColumnFilter }),
      [responsiveMode, columnFilters, setColumnFilter]
    );

    const isDataDriven = columns !== undefined && data !== undefined;

    return (
      <TableContext.Provider value={contextValue}>
        <TableMoleculeView
          ref={ref}
          responsiveMode={responsiveMode}
          wrapperClassName={wrapperClassName}
          pagination={pagination}
          {...props}
        >
          {isDataDriven
            ? <DataDrivenTableContent
                columns={columns}
                data={data}
                caption={caption}
                emptyMessage={emptyMessage}
              />
            : children}
        </TableMoleculeView>
      </TableContext.Provider>
    );
  }
);
TableMoleculeImpl.displayName = 'TableMolecule';

// ─── JSX-children helpers (unchanged) ─────────────────────────────────────────

function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join(' ').trim();
  if (!React.isValidElement(node)) return '';
  return getTextContent((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
}

function getSpanValue(value: unknown) {
  const parsed = Number(value ?? 1);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function getHeaderLayout(children: React.ReactNode) {
  const rows = React.Children.toArray(children).filter(React.isValidElement);
  const grid: Array<Array<{ label: string } | undefined>> = [];
  const columnIndexes = new WeakMap<object, number>();

  rows.forEach((row, rowIndex) => {
    const rowEl = row as React.ReactElement<{ children?: React.ReactNode }>;
    grid[rowIndex] = grid[rowIndex] ?? [];
    let colIndex = 0;

    React.Children.forEach(rowEl.props.children, (head) => {
      if (!React.isValidElement(head)) return;

      while (grid[rowIndex][colIndex]) colIndex += 1;

      const headProps = head.props as {
        children?: React.ReactNode;
        colSpan?: number | string;
        rowSpan?: number | string;
      };
      const colSpan = getSpanValue(headProps.colSpan);
      const rowSpan = getSpanValue(headProps.rowSpan);
      const label = getTextContent(headProps.children);
      columnIndexes.set(head, colIndex);

      for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
        const targetRow = rowIndex + rowOffset;
        grid[targetRow] = grid[targetRow] ?? [];
        for (let colOffset = 0; colOffset < colSpan; colOffset += 1) {
          grid[targetRow][colIndex + colOffset] = { label };
        }
      }

      colIndex += colSpan;
    });
  });

  const maxColumns = Math.max(0, ...grid.map((row) => row.length));
  const labels = Array.from({ length: maxColumns }, (_, columnIndex) => {
    for (let rowIndex = grid.length - 1; rowIndex >= 0; rowIndex -= 1) {
      const cell = grid[rowIndex]?.[columnIndex];
      if (cell?.label) return cell.label;
    }
    return '';
  });

  return { labels, columnIndexes };
}

function withHeaderColumnIndexes(children: React.ReactNode) {
  const { labels, columnIndexes } = getHeaderLayout(children);
  const rows = React.Children.map(children, (row) => {
    if (!React.isValidElement(row)) return row;
    const rowEl = row as React.ReactElement<{ children?: React.ReactNode }>;
    const heads = React.Children.map(rowEl.props.children, (head) => {
      if (!React.isValidElement(head)) return head;
      const columnIndex = columnIndexes.get(head);
      if (columnIndex === undefined) return head;
      return React.cloneElement(head as React.ReactElement, { columnIndex });
    });
    return React.cloneElement(rowEl, {}, heads);
  });
  return { labels, rows };
}

export const TableHeaderImpl = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => {
    const { labelsRef } = useTableContext();
    const { labels, rows } = withHeaderColumnIndexes(children);
    labelsRef.current = labels;
    return (
      <TableHeaderView ref={ref} {...props}>
        {rows}
      </TableHeaderView>
    );
  }
);
TableHeaderImpl.displayName = 'TableHeader';

function rowMatchesFilters(row: React.ReactElement<{ children?: React.ReactNode }>, filters: Record<number, string>) {
  const activeFilters = Object.entries(filters).filter(([, value]) => value.trim());
  if (activeFilters.length === 0) return true;
  const cells = React.Children.toArray(row.props.children).filter(React.isValidElement);
  return activeFilters.every(([columnIndex, filter]) => {
    const cell = cells[Number(columnIndex)] as React.ReactElement<{ children?: React.ReactNode }> | undefined;
    if (!cell) return false;
    return getTextContent(cell.props.children).toLowerCase().includes(filter.toLowerCase());
  });
}

export const TableBodyImpl = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => {
    const { labelsRef, responsiveMode, columnFilters } = useTableContext();
    const labels = labelsRef.current;

    const rowsWithLabels = React.Children.map(children, (row) => {
      if (!React.isValidElement(row)) return row;
      const rowEl = row as React.ReactElement<{ children?: React.ReactNode }>;
      if (!rowMatchesFilters(rowEl, columnFilters)) return null;
      if (responsiveMode !== 'cards') return rowEl;

      const cells = React.Children.map(rowEl.props.children, (cell, colIdx) => {
        if (!React.isValidElement(cell)) return cell;
        if ((cell.props as Record<string, unknown>)['data-label'] !== undefined) return cell;
        const label = labels[colIdx];
        if (!label) return cell;
        return React.cloneElement(cell as React.ReactElement, { 'data-label': label });
      });
      return React.cloneElement(rowEl, {}, cells);
    });

    return (
      <TableBodyView ref={ref} {...props}>
        {rowsWithLabels}
      </TableBodyView>
    );
  }
);
TableBodyImpl.displayName = 'TableBody';

// ─── Data-driven renderer ─────────────────────────────────────────────────────

function DataDrivenTableContent({
  columns,
  data,
  caption,
  emptyMessage = 'Sin resultados',
}: {
  columns: TableColumnsConfig;
  data: Record<string, unknown>[];
  caption?: string;
  emptyMessage?: string;
}) {
  const { columnFilters } = useTableContext();
  const [internalSort, setInternalSort] = useState<{ key: string; direction: TableSortDirection }>({
    key: '',
    direction: null,
  });

  const hasGroups = columns.length > 0 && isColumnGroup(columns[0] as TableColumnDef | TableColumnGroup);
  const leafCols = useMemo(() => getLeafColumns(columns), [columns]);

  // Internal sort: applies only when the sorted column has no controlled onSortChange
  const sortedData = useMemo(() => {
    if (!internalSort.key || !internalSort.direction) return data;
    const sortedCol = leafCols.find((c) => c.key === internalSort.key);
    if (sortedCol?.onSortChange !== undefined) return data; // controlled — caller pre-sorted
    return sortDataByKey(data, internalSort.key, internalSort.direction);
  }, [data, internalSort, leafCols]);

  // Auto-filter via context: skip columns that have a controlled filterValue/onFilterChange
  const filteredData = useMemo(() => {
    const uncontrolledIdxs = new Set(
      leafCols
        .map((col, idx) => (col.filterValue === undefined && col.onFilterChange === undefined ? idx : -1))
        .filter((idx) => idx >= 0)
    );
    const activeFilters = Object.entries(columnFilters)
      .filter(([idxStr]) => uncontrolledIdxs.has(Number(idxStr)))
      .filter(([, v]) => v.trim());

    if (activeFilters.length === 0) return sortedData;
    return sortedData.filter((row) =>
      activeFilters.every(([idxStr, filter]) => {
        const col = leafCols[Number(idxStr)];
        if (!col) return false;
        return String(row[col.key] ?? '').toLowerCase().includes(filter.toLowerCase());
      })
    );
  }, [sortedData, columnFilters, leafCols]);

  const handleSortChange = (col: TableColumnDef) => (direction: TableSortDirection) => {
    if (col.onSortChange) {
      col.onSortChange(direction);
    } else {
      setInternalSort({ key: col.key, direction });
    }
  };

  const renderHeadCell = (col: TableColumnDef, colIdx: number) => {
    const isControlledSort = col.onSortChange !== undefined;
    const effectiveSortDir = col.sortable
      ? isControlledSort
        ? (col.sortDirection ?? null)
        : (internalSort.key === col.key ? internalSort.direction : null)
      : null;

    return (
      <TableHeadView
        key={col.key}
        columnIndex={colIdx}
        sortable={col.sortable}
        sortDirection={effectiveSortDir}
        onSortChange={col.sortable ? handleSortChange(col) : undefined}
        filterable={col.filterable}
        filterPlaceholder={col.filterPlaceholder}
        filterValue={col.filterValue}
        onFilterChange={col.onFilterChange}
        resizable={col.resizable}
        width={col.width}
        minWidth={col.minWidth}
        maxWidth={col.maxWidth}
      >
        {col.header}
      </TableHeadView>
    );
  };

  return (
    <>
      {caption && <TableCaptionView>{caption}</TableCaptionView>}
      <TableHeaderView>
        {hasGroups ? (
          <>
            <TableRowView>
              {(columns as TableColumnGroup[]).map((group) => (
                <TableHeadView key={group.label} colSpan={group.columns.length} groupHeader>
                  {group.label}
                </TableHeadView>
              ))}
            </TableRowView>
            <TableRowView>
              {leafCols.map((col, colIdx) => renderHeadCell(col, colIdx))}
            </TableRowView>
          </>
        ) : (
          <TableRowView>
            {(columns as TableColumnDef[]).map((col, colIdx) => renderHeadCell(col, colIdx))}
          </TableRowView>
        )}
      </TableHeaderView>
      <TableBodyView>
        {filteredData.length > 0 ? (
          filteredData.map((row, rowIdx) => (
            <TableRowView key={rowIdx}>
              {leafCols.map((col) => (
                <TableCellView
                  key={col.key}
                  data-label={col.header}
                  className={col.align ? alignClass[col.align] : undefined}
                >
                  {col.render
                    ? col.render(row[col.key], row, rowIdx)
                    : String(row[col.key] ?? '')}
                </TableCellView>
              ))}
            </TableRowView>
          ))
        ) : (
          <TableRowView>
            <TableCellView colSpan={leafCols.length}>
              <span className="block py-6 text-center text-neutral-400">{emptyMessage}</span>
            </TableCellView>
          </TableRowView>
        )}
      </TableBodyView>
    </>
  );
}

// ─── Simple pass-through re-exports ───────────────────────────────────────────

export const TableCaptionImpl = TableCaptionView;
export const TableFooterImpl = TableFooterView;
export const TableRowImpl = TableRowView;
export const TableHeadImpl = TableHeadView;
export const TableCellImpl = TableCellView;
