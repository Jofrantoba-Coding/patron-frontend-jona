import type { Pagination } from '../../services/InterCatalogService';
import { isoToDisplay } from '../../../mock-server/core/dates.js';
import { filterRows, sortKeyOf, sortRows, type SortState } from './filterSort';

export const LIST_PAGE_SIZE = 20;

export interface ListViewState {
  filterText: string;
  sort?: SortState<string>;
  page: number;
}

export interface ListViewResult<T> {
  /** The visible page. */
  rows: T[];
  /** Effective page, clamped into range. */
  page: number;
  pageCount: number;
  /** Rows left after filtering. */
  matchCount: number;
}

/**
 * Rows as the grid shows them: a `bool` column reads Sí / No, a `dec` column the stored number as text, with no
 * rounding, and a `date` column dd/MM/yyyy (a missing value is empty), so the filter and the sort work on the rendered text (R-CRUD-1). Rows come back
 * untouched when no column needs formatting.
 */
export function formatRows<T>(columns: readonly { key: keyof T & string; format?: 'bool' | 'dec' | 'date' }[], rows: readonly T[]): T[] {
  const formatted = columns.filter((column) => column.format !== undefined);
  if (formatted.length === 0) return rows as T[];
  return rows.map((row) => {
    const shown = { ...row } as Record<string, unknown>;
    for (const { key, format } of formatted) {
      const value = row[key];
      if (format === 'date') {
        shown[key] = isoToDisplay(value);
        shown[sortKeyOf(key)] = typeof value === 'string' ? value : '';
      } else shown[key] = format === 'bool' ? (value === true ? 'Sí' : value === false ? 'No' : '') : value === undefined || value === null ? '' : String(value);
    }
    return shown as T;
  });
}

/** Client-side list pipeline: filter, then sort, then take one page of 20. */
export function applyListView<T>(
  rows: readonly T[],
  { filterText, sort, page }: ListViewState,
  filterKeys: readonly (keyof T)[],
): ListViewResult<T> {
  const matches = sortRows(filterRows(rows, filterText, filterKeys), sort);
  const pageCount = Math.max(1, Math.ceil(matches.length / LIST_PAGE_SIZE));
  const effective = Math.min(Math.max(1, page), pageCount);
  const start = (effective - 1) * LIST_PAGE_SIZE;
  return { rows: matches.slice(start, start + LIST_PAGE_SIZE), page: effective, pageCount, matchCount: matches.length };
}

/** Applies a change; touching the filter or the sort goes back to page 1 unless a page is given. */
export function withListViewChange(state: ListViewState, change: Partial<ListViewState>): ListViewState {
  const resetsPage = 'filterText' in change || 'sort' in change;
  return { ...state, ...(resetsPage ? { page: 1 } : {}), ...change };
}

/** True when the server holds more rows than the single fetch brought (the list is cut). */
export function isTruncated({ total }: Pagination, fetched: number): boolean {
  return total > fetched;
}

/** Page that holds the row with `id` under the current filter and sort; undefined when it is filtered out. */
export function pageOfRow<T>(rows: readonly T[], state: ListViewState, filterKeys: readonly (keyof T)[], idKey: keyof T, id: string): number | undefined {
  const index = sortRows(filterRows(rows, state.filterText, filterKeys), state.sort).findIndex((row) => String(row[idKey]) === id);
  return index < 0 ? undefined : Math.floor(index / LIST_PAGE_SIZE) + 1;
}
