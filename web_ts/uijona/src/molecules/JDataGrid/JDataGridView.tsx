// JDataGridView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { JTableBody, JTableCell, JTableHeader, JTableRow } from '../JTable';
import { JBadge } from '../../atoms/JBadge';
import { JSkeleton } from '../../atoms/JSkeleton';
import {
  DANGER_FG, FG_MUTED, FOCUS_OUTLINE, FOCUS_RING, HOVER_FG, LINE, SURFACE, SURFACE_MUTED, TEXT_CAPTION, TEXT_TABLE,
} from '../../theme/tokenClasses';
import { JDataGridColumn, JDataGridLoading, JDataGridRowState, JDataGridSortDirection } from './InterJDataGrid';

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;
const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

const SortIcon: React.FC<{ direction: JDataGridSortDirection | null }> = ({ direction }) => (
  <svg className="ms-1 inline h-3.5 w-3.5 align-[-2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    {direction !== 'desc' && <polyline points="6 9 12 3 18 9" />}
    {direction !== 'asc' && <polyline points="6 15 12 21 18 15" />}
  </svg>
);

export interface JDataGridViewRow<T> {
  key: string;
  row: T;
  selected: boolean;
  state: JDataGridRowState;
  badgeId: string;
  errorId: string;
}

/** Skeleton rows shown while the first page loads. */
const SKELETON_ROWS = 5;

export interface JDataGridViewProps<T> {
  ariaLabel: string;
  columns: JDataGridColumn<T>[];
  rows: JDataGridViewRow<T>[];
  tabStop: string | null;
  loading: JDataGridLoading;
  loadingLabel: string;
  empty?: React.ReactNode;
  maxHeight?: string;
  sort?: { key: string; direction: JDataGridSortDirection };
  setRowRef: (key: string) => (element: HTMLTableRowElement | null) => void;
  onRowClick: (key: string) => void;
  onRowDoubleClick: (key: string) => void;
  onRowFocus: (key: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTableSectionElement>) => void;
  onSortChange?: (key: string, direction: JDataGridSortDirection) => void;
}

const cellText = <T,>(row: T, column: JDataGridColumn<T>): React.ReactNode =>
  column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '');

export function JDataGridView<T>({
  ariaLabel, columns, rows, tabStop, loading, loadingLabel, empty, maxHeight, sort, setRowRef, onRowClick, onRowDoubleClick, onRowFocus, onKeyDown, onSortChange,
}: JDataGridViewProps<T>) {
  const initial = loading === 'initial';
  return (
    <div
      style={maxHeight ? ({ '--jona-grid-max-h': maxHeight } as React.CSSProperties) : undefined}
      className={cn(
        'relative w-full min-w-0 max-w-full max-h-[var(--jona-grid-max-h)] overflow-auto rounded-md border',
        LINE,
        SURFACE,
      )}
    >
      {initial && <p role="status" className="sr-only">{loadingLabel}</p>}
      {loading === 'refresh' && (
        <div role="progressbar" aria-label={loadingLabel} className="absolute inset-x-0 top-0 z-[2] h-0.5 overflow-hidden">
          <div className="h-full w-1/3 animate-pulse bg-primary-600" />
        </div>
      )}
      <table
        role="grid"
        aria-label={ariaLabel}
        aria-busy={loading === 'refresh' ? true : undefined}
        className={cn('w-full min-w-max caption-bottom', TEXT_TABLE)}
      >
        <JTableHeader className={cn('sticky top-0 z-[1]', SURFACE_MUTED)}>
          <JTableRow role="row">
            {columns.map((column) => {
              const direction = sort?.key === column.key ? sort.direction : null;
              return (
                <th
                  key={column.key}
                  role="columnheader"
                  scope="col"
                  aria-sort={direction ? ARIA_SORT[direction] : undefined}
                  style={column.width ? { width: column.width } : undefined}
                  className={cn('h-9 whitespace-nowrap px-3 align-middle font-medium', FG_MUTED, ALIGN[column.align ?? 'left'])}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.key, direction === 'asc' ? 'desc' : 'asc')}
                      className={cn('rounded-sm font-medium focus-visible:outline-none focus-visible:ring-2', HOVER_FG, FOCUS_RING)}
                    >
                      {column.header}
                      <SortIcon direction={direction} />
                    </button>
                  ) : (
                    <span>{column.header}</span>
                  )}
                </th>
              );
            })}
          </JTableRow>
        </JTableHeader>
        <JTableBody onKeyDown={onKeyDown}>
          {initial &&
            Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <JTableRow key={index} aria-hidden="true">
                {columns.map((column) => (
                  <JTableCell key={column.key} className="px-3 py-2">
                    <JSkeleton className="h-4 w-full" />
                  </JTableCell>
                ))}
              </JTableRow>
            ))}
          {!initial && rows.length === 0 && empty !== undefined && (
            <JTableRow role="row">
              <JTableCell role="gridcell" colSpan={columns.length} className="px-3 py-6 text-center">
                {empty}
              </JTableCell>
            </JTableRow>
          )}
          {!initial && rows.map(({ key, row, selected, state, badgeId, errorId }) => (
            <JTableRow
              key={key}
              ref={setRowRef(key)}
              role="row"
              selected={selected}
              aria-invalid={state.error ? true : undefined}
              aria-describedby={[state.badge && badgeId, state.error && errorId].filter(Boolean).join(' ') || undefined}
              data-muted={state.muted ? 'true' : undefined}
              tabIndex={tabStop === key ? 0 : -1}
              onClick={() => onRowClick(key)}
              onDoubleClick={() => onRowDoubleClick(key)}
              onFocus={(event) => {
                if (event.target === event.currentTarget) onRowFocus(key);
              }}
              className={cn(
                'cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2',
                FOCUS_OUTLINE,
                state.muted && 'opacity-60',
              )}
            >
              {columns.map((column, index) => (
                <JTableCell key={column.key} role="gridcell" className={cn('px-3 py-2', ALIGN[column.align ?? 'left'])}>
                  {cellText(row, column)}
                  {index === 0 && state.badge && (
                    <span id={badgeId} aria-hidden="true" className="ms-2 inline-block align-middle">
                      <JBadge variant={state.badge.variant}>{state.badge.label}</JBadge>
                    </span>
                  )}
                  {index === 0 && state.error && (
                    <span id={errorId} className={cn('block', TEXT_CAPTION, DANGER_FG)}>{state.error}</span>
                  )}
                </JTableCell>
              ))}
            </JTableRow>
          ))}
        </JTableBody>
      </table>
    </div>
  );
}
