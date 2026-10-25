// JDataTableView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JDataTableColumn, JDataTableResponsiveMode, JDataTableSort, JDataTableSortDirection } from './InterJDataTable';
import { JTextBox } from '../../atoms/JTextBox';
import { JPanel } from '../../atoms/JPanel/JPanel';

function SortIcon({ direction }: { direction: JDataTableSortDirection }) {
  return (
    <svg className="ml-1 inline-block h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <polyline points="6 9 12 3 18 9" className={direction === 'asc' ? 'text-primary-600' : 'text-neutral-300'} />
      <polyline points="6 15 12 21 18 15" className={direction === 'desc' ? 'text-primary-600' : 'text-neutral-300'} />
    </svg>
  );
}

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
  responsiveMode: JDataTableResponsiveMode;
  mobileActionLabel: string;
  className?: string;
  onSortChange?: (sort: JDataTableSort) => void;
  onFilterChange?: (value: string) => void;
  onRowClick?: (row: T, index: number) => void;
}

export function JDataTableView<T>({
  columns, rows, rowKey, sort, loading, emptyTitle, emptyDescription,
  filterValue, filterPlaceholder, showFilter, stickyHeader, responsiveMode, mobileActionLabel, className,
  onSortChange, onFilterChange, onRowClick,
}: JDataTableViewProps<T>) {
  const isCards = responsiveMode === 'cards';
  const isScroll = responsiveMode === 'scroll';
  const handleHeaderClick = (col: JDataTableColumn<T>) => {
    if (!col.sortable || !onSortChange) return;
    const next: JDataTableSortDirection = sort?.key === col.key ? (sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc') : 'asc';
    onSortChange({ key: col.key, direction: next });
  };

  return (
    <JPanel variant="ghost" padding="none" radius="none" className={cn('flex w-full flex-col gap-3', className)}>
      {/* Filter bar */}
      {showFilter && (
        <JPanel variant="ghost" padding="none" radius="none" className="flex flex-row items-center gap-2">
          <JPanel variant="ghost" padding="none" radius="none" className="relative flex-1">
            <svg className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <JTextBox
              type="text"
              value={filterValue}
              onChange={(value) => onFilterChange?.(value)}
              placeholder={filterPlaceholder}
              aria-label={filterPlaceholder}
              className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-8 pr-3 text-base placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:h-9 sm:text-sm"
            />
          </JPanel>
        </JPanel>
      )}

      {/* Scroll mode: phone-only hint that the table scrolls sideways */}
      {isScroll && (
        <p className="text-xs text-neutral-500 sm:hidden">
          Deslice horizontalmente para consultar todas las columnas.
        </p>
      )}

      {/* JTable wrapper — a focusable scroll region in scroll mode; in cards
          mode the cards flow on the page below md: and the table returns at md: */}
      <JPanel
        variant="ghost"
        padding="none"
        radius="none"
        role={isScroll ? 'region' : undefined}
        tabIndex={isScroll ? 0 : undefined}
        aria-label={isScroll ? 'Tabla de datos desplazable horizontalmente' : undefined}
        className={cn(
          'relative max-w-full rounded-md border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          isScroll ? 'overflow-auto' : 'overflow-visible border-0 md:overflow-auto md:border',
        )}
      >
        <table className={isCards ? 'block w-full min-w-0 caption-bottom text-sm md:table' : 'w-full min-w-max caption-bottom text-sm'}>
          <thead className={cn('bg-neutral-50 [&_tr]:border-b', isCards && 'max-md:hidden', stickyHeader && 'sticky top-0 z-10')}>
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
          <tbody className={cn('[&_tr:last-child]:border-0', isCards && 'max-md:block')}>
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
                  onRowClick && 'cursor-pointer hover:bg-neutral-50',
                  isCards && 'mb-3 grid min-w-0 grid-cols-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-x-0 md:border-t-0 md:bg-transparent md:p-0 md:shadow-none'
                )}
              >
                {columns.map((col, ci) => {
                  const raw = (row as Record<string, unknown>)[col.key];
                  return (
                    <td
                      key={col.key}
                      data-label={isCards ? col.header : undefined}
                      style={isCards ? { order: col.mobilePriority ?? ci + 20 } : undefined}
                      className={cn(
                        'px-4 py-3 align-middle text-neutral-900',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        isCards && [
                          'flex min-w-0 flex-col gap-1 border-b border-neutral-100 px-0 py-2 text-left last:border-b-0',
                          'before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-500',
                          'before:content-[attr(data-label)] md:table-cell md:border-0 md:px-4 md:py-3 md:before:content-none',
                          col.align === 'center' && 'md:text-center',
                          col.align === 'right' && 'md:text-right',
                        ],
                        isCards && (col.mobilePriority ?? 99) <= 4 && 'font-medium'
                      )}
                    >
                      {col.render ? col.render(raw, row, ri) : String(raw ?? '')}
                    </td>
                  );
                })}
                {/* Cards: a full-width 44px action, easier to hit than the whole card */}
                {isCards && onRowClick && (
                  <td className="order-[999] pt-3 md:hidden">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onRowClick(row, ri); }}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                      {mobileActionLabel}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </JPanel>
    </JPanel>
  );
}
