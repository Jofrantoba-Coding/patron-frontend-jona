// InterJPagination.ts — JONA Interface

export interface InterJPagination {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  className?: string;
  // Observer events
  onPageChange?: (page: number) => void;
  onPrevious?: (currentPage: number) => void;
  onNext?: (currentPage: number) => void;
  onFirstPageReached?: () => void;
  onLastPageReached?: () => void;
}

export const JPAGINATION_DEFAULTS: Required<Pick<InterJPagination, 'siblingCount'>> = {
  siblingCount: 1,
};
