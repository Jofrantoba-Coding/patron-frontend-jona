// InterPaginationMolecule.ts — JONA Interface

export interface InterPaginationMolecule {
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

export const PAGINATION_MOLECULE_DEFAULTS: Required<Pick<InterPaginationMolecule, 'siblingCount'>> = {
  siblingCount: 1,
};
