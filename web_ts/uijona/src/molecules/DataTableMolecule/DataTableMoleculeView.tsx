// DataTableMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { DataTableColumn, DataTableSort, SortDirection } from './InterDataTableMolecule';
import { InputAtom } from '../../atoms/InputAtom';
import { JPanel } from '../../atoms/JPanel/JPanel';

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <svg className="ml-1 inline-block h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <polyline points="6 9 12 3 18 9" className={direction === 'asc' ? 'text-primary-600' : 'text-neutral-300'} />
      <polyline points="6 15 12 21 18 15" className={direction === 'desc' ? 'text-primary-600' : 'text-neutral-300'} />
    </svg>
  );
}

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

export function DataTableMoleculeView<T>({
  columns, rows, rowKey, sort, loading, emptyTitle, emptyDescription,
  filterValue, filterPlaceholder, showFilter, stickyHeader, className,
  onSortChange, onFilterChange, onRowClick,
}: DataTableMoleculeViewProps<T>) {
  const handleHeaderClick = (col: DataTableColumn<T>) => {
    if (!col.sortable || !onSortChange) return;
    const next: SortDirection = sort?.key === col.key ? (sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc') : 'asc';
    onSortChange({ key: col.key, direction: next });
  };

  return (
    <JPanel variant="ghost" padding="none" radius="none" className={cn('flex w-full flex-col gap-3', className)}>
      {/* Filter bar */}
      {showFilter && (
        <JPanel variant="ghost" padding="none" radius="none" className="flex items-center gap-2">
          <JPanel variant="ghost" padding="none" radius="none" className="relative flex-1">
            <svg className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <InputAtom
              type="text"
              value={filterValue}
              onChange={(value) => onFilterChange?.(value)}
              placeholder={filterPlaceholder}
              aria-label={filterPlaceholder}
              className="h-9 w-full rounded-md border border-neutral-300 bg-white pl-8 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </JPanel>
        </JPanel>
      )}

      {/* Table wrapper */}
      <JPanel variant="ghost" padding="none" radius="none" className="relative max-w-full overflow-auto rounded-md border border-neutral-200">
        <table className="w-full min-w-max caption-bottom text-sm">
          <thead className={cn('bg-neutral-50 [&_tr]:border-b', stickyHeader && 'sticky top-0 z-10')}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => handleHeaderClick(col)}
                  aria-sort={sort?.key === col.key ? (sort.direction === 'asc' ? 'ascending' : sort.direction === 'desc' ? 'descending' : undefined) : undefined}
                  className={cn(
                    'h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-neutral-500 select-none',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer hover:text-neutral-800'
                  )}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.sortable && (
                      <SortIcon direction={sort?.key === col.key ? sort.direction ?? null : null} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {/* Loading state */}
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col items-center gap-2 text-neutral-400">
                    <svg className="h-6 w-6 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span className="text-sm">Cargando...</span>
                  </JPanel>
                </td>
              </tr>
            )}
            {/* Empty state */}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col items-center gap-1 text-neutral-400">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <p className="text-sm font-medium text-neutral-600">{emptyTitle}</p>
                    <p className="text-xs text-neutral-400">{emptyDescription}</p>
                  </JPanel>
                </td>
              </tr>
            )}
            {/* Data rows */}
            {!loading && rows.map((row, ri) => (
              <tr
                key={rowKey(row, ri)}
                onClick={onRowClick ? () => onRowClick(row, ri) : undefined}
                className={cn(
                  'border-b border-neutral-100 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-neutral-50'
                )}
              >
                {columns.map((col) => {
                  const raw = (row as Record<string, unknown>)[col.key];
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 align-middle text-neutral-900',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right'
                      )}
                    >
                      {col.render ? col.render(raw, row, ri) : String(raw ?? '')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </JPanel>
    </JPanel>
  );
}
