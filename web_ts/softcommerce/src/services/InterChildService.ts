import type { ListQuery, Page } from './InterCatalogService';

/**
 * The nested child routes of one catalog, `/v1/{catalog}/{id}/{child}[/{childId}]` (R-MOCK-19). The parent is checked once (404 when unknown, deleted,
 * of another tenant or empresa); `remove` follows the child removal kind (deactivate keeps the row listed with `estado` `D`). Kept apart from
 * `InterCatalogService`, whose method set the W1 contract pins (S-LOC-17).
 */
export interface InterChildService {
  list<C = Record<string, any>>(parentId: string, child: string, query?: ListQuery): Promise<Page<C>>;
  get<C = Record<string, any>>(parentId: string, child: string, id: string): Promise<C>;
  create<C = Record<string, any>>(parentId: string, child: string, values: Partial<C>): Promise<C>;
  update<C = Record<string, any>>(parentId: string, child: string, id: string, values: Partial<C>): Promise<C>;
  remove(parentId: string, child: string, id: string): Promise<void>;
}
