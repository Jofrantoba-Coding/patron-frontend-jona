import React, { forwardRef, useMemo, useRef } from 'react';
import { InterTableMolecule, TABLE_MOLECULE_DEFAULTS, TableContextValue } from './InterTableMolecule';
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
    const contextValue = useMemo(
      () => ({ responsiveMode, labelsRef }),
      [responsiveMode]
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

export const TableHeaderImpl = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => {
    const { labelsRef } = useTableContext();

    const labels: string[] = [];
    React.Children.forEach(children, (row) => {
      if (!React.isValidElement(row)) return;
      React.Children.forEach(
        (row as React.ReactElement<{ children?: React.ReactNode }>).props.children,
        (head) => {
          if (!React.isValidElement(head)) return;
          labels.push(getTextContent((head as React.ReactElement<{ children?: React.ReactNode }>).props.children));
        }
      );
    });
    labelsRef.current = labels;

    return (
      <TableHeaderView ref={ref} {...props}>
        {children}
      </TableHeaderView>
    );
  }
);
TableHeaderImpl.displayName = 'TableHeader';

export const TableBodyImpl = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => {
    const { labelsRef, responsiveMode } = useTableContext();
    const labels = labelsRef.current;

    const rowsWithLabels = responsiveMode === 'cards'
      ? React.Children.map(children, (row) => {
        if (!React.isValidElement(row)) return row;
        const rowEl = row as React.ReactElement<{ children?: React.ReactNode }>;
        const cells = React.Children.map(rowEl.props.children, (cell, colIdx) => {
          if (!React.isValidElement(cell)) return cell;
          if ((cell.props as Record<string, unknown>)['data-label'] !== undefined) return cell;
          const label = labels[colIdx];
          if (!label) return cell;
          return React.cloneElement(cell as React.ReactElement, { 'data-label': label });
        });
        return React.cloneElement(rowEl, {}, cells);
      })
      : children;

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
