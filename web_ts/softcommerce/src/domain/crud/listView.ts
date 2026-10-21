import type { Pagination } from '../../services/InterCatalogService';
import { filterRows, sortRows, type SortState } from './filterSort';

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
