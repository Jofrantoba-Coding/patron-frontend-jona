export interface InterJPagination {
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
export declare const JPAGINATION_DEFAULTS: Required<Pick<InterJPagination, 'siblingCount'>>;
