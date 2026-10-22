/** Server-side paging and field filters; the W1 list view fetches one big page instead. */
export interface ListQuery {
  page?: number;
  pageSize?: number;
  /** `<field>=<needle>` substring filters. */
  filters?: Record<string, string>;
}

export interface Pagination {
  page: number;
  pageSize: number;
  /** Count of every active record, not only this page. */
  total: number;
}

export interface Page<T> {
  items: T[];
  pagination: Pagination;
}

/**
 * Generic CRUD over one catalog (`/v1/{catalog}`). `remove` is a logical delete.
 * Failures reject with `ApiError`; the tenant comes from the session.
 */
export interface InterCatalogService<T> {
  list(query?: ListQuery): Promise<Page<T>>;
  get(id: string): Promise<T>;
  create(values: Partial<T>): Promise<T>;
  update(id: string, values: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}
