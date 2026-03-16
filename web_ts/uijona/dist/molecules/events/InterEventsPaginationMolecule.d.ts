export interface InterEventsPaginationMolecule {
    onPageChange?: (page: number) => void;
    onPrevious?: (currentPage: number) => void;
    onNext?: (currentPage: number) => void;
    onFirstPageReached?: () => void;
    onLastPageReached?: () => void;
}
