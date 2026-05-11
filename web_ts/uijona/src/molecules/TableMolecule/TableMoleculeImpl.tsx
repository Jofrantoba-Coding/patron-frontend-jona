import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { InterTableMolecule, TABLE_MOLECULE_DEFAULTS } from './InterTableMolecule';
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

export const TableMoleculeImpl = forwardRef<HTMLTableElement, InterTableMolecule>(
  ({ children, responsiveMode = TABLE_MOLECULE_DEFAULTS.responsiveMode, wrapperClassName, ...props }, ref) => {
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

    return (
      <TableContext.Provider value={contextValue}>
        <TableMoleculeView
          ref={ref}
          responsiveMode={responsiveMode}
          wrapperClassName={wrapperClassName}
          {...props}
        >
          {children}
        </TableMoleculeView>
      </TableContext.Provider>
    );
  }
);
TableMoleculeImpl.displayName = 'TableMolecule';

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
      if (responsiveMode === 'none') return rowEl;

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

export const TableCaptionImpl = TableCaptionView;
export const TableFooterImpl = TableFooterView;
export const TableRowImpl = TableRowView;
export const TableHeadImpl = TableHeadView;
export const TableCellImpl = TableCellView;
