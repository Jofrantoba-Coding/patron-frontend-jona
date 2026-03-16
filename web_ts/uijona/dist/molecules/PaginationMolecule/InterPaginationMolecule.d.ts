export interface InterPaginationMolecule {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
    className?: string;
    onPageChange?: (page: number) => void;
    onPrevious?: (currentPage: number) => void;
    onNext?: (currentPage: number) => void;
    onFirstPageReached?: () => void;
    onLastPageReached?: () => void;
}
export declare const PAGINATION_MOLECULE_DEFAULTS: Required<Pick<InterPaginationMolecule, 'siblingCount'>>;
