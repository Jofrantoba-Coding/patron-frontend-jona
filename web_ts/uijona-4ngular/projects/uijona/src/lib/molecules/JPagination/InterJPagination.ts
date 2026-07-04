/** Contrato publico de JPagination. */
export interface InterJPagination {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}
