// InterEventsPaginationMolecule.ts — Observer: Event Contract for PaginationMolecule
// Declares every event PaginationMolecule can emit.

export interface InterEventsPaginationMolecule {
  /** Fired when the user navigates to a page — carries the new page number */
  onPageChange?: (page: number) => void;

  /** Fired when the user clicks Previous */
  onPrevious?: (currentPage: number) => void;

  /** Fired when the user clicks Next */
  onNext?: (currentPage: number) => void;

  /** Fired when the user tries to go before page 1 (boundary reached) */
  onFirstPageReached?: () => void;

  /** Fired when the user tries to go past the last page (boundary reached) */
  onLastPageReached?: () => void;
}
