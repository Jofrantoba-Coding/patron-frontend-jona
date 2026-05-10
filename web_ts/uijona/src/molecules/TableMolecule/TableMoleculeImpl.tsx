// TableMoleculeImpl.tsx — JONA Implementation
import React, { createContext, forwardRef, useContext, useRef } from 'react';
import {
  TableMoleculeView, TableCaptionView, TableHeaderView, TableBodyView,
  TableFooterView, TableRowView, TableHeadView, TableCellView,
} from './TableMoleculeView';

interface TableLabelsContextValue {
  labelsRef: React.MutableRefObject<string[]>;
}
const TableLabelsContext = createContext<TableLabelsContextValue>({
  labelsRef: { current: [] },
});

export const TableMoleculeImpl = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ children, ...props }, ref) => {
    const labelsRef = useRef<string[]>([]);
    return (
      <TableLabelsContext.Provider value={{ labelsRef }}>
        <TableMoleculeView ref={ref} {...props}>{children}</TableMoleculeView>
      </TableLabelsContext.Provider>
    );
  }
);
TableMoleculeImpl.displayName = 'TableMolecule';

// Captura los textos de <th> síncronamente — thead siempre renderiza antes que tbody
export const TableHeaderImpl = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => {
    const { labelsRef } = useContext(TableLabelsContext);

    const labels: string[] = [];
    React.Children.forEach(children, (row) => {
      if (!React.isValidElement(row)) return;
      React.Children.forEach(
        (row as React.ReactElement<{ children?: React.ReactNode }>).props.children,
        (head) => {
          if (!React.isValidElement(head)) return;
          const text = (head as React.ReactElement<{ children?: React.ReactNode }>).props.children;
          labels.push(typeof text === 'string' ? text : '');
        }
      );
    });
    labelsRef.current = labels;

    return <TableHeaderView ref={ref} {...props}>{children}</TableHeaderView>;
  }
);
TableHeaderImpl.displayName = 'TableHeader';

// Inyecta data-label en cada <td> por índice de columna; respeta data-label manual
export const TableBodyImpl = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => {
    const { labelsRef } = useContext(TableLabelsContext);
    const labels = labelsRef.current;

    const rowsWithLabels = React.Children.map(children, (row) => {
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
    });

    return <TableBodyView ref={ref} {...props}>{rowsWithLabels}</TableBodyView>;
  }
);
TableBodyImpl.displayName = 'TableBody';

export const TableCaptionImpl = TableCaptionView;
export const TableFooterImpl = TableFooterView;
export const TableRowImpl = TableRowView;
export const TableHeadImpl = TableHeadView;
export const TableCellImpl = TableCellView;
