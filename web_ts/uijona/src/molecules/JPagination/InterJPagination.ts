// InterJPagination.ts — JONA Interface

export interface InterJPagination {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  className?: string;
  /** Rows info (R-DAT-7): the total row count and the page size. */
  totalRows?: number;
  pageSize?: number;
  /** Shows `{first}–{last} de {total}` next to the pages; without it the 1.5.1 output. */
  showRowsInfo?: boolean;
  rowsInfoLabel?: (first: number, last: number, total: number) => string;
  // Observer events
  onPageChange?: (page: number) => void;
  onPrevious?: (currentPage: number) => void;
  onNext?: (currentPage: number) => void;
  onFirstPageReached?: () => void;
  onLastPageReached?: () => void;
}

/** `1–20 de 134`; `0 de 0` with no rows. */
export const formatRowsInfo = (first: number, last: number, total: number): string =>
  total === 0 ? '0 de 0' : `${first}–${last} de ${total}`;

export const JPAGINATION_DEFAULTS: Required<Pick<InterJPagination, 'siblingCount' | 'showRowsInfo' | 'rowsInfoLabel'>> = {
  siblingCount: 1,
  showRowsInfo: false,
  rowsInfoLabel: formatRowsInfo,
};
