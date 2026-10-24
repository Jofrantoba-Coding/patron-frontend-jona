import { parsePermissions } from '../domain/permissions';
import type { MenuItem } from '../domain/menuTree';
import type { GrantsSnapshot, InterGrantsService } from './InterGrantsService';
import type { HttpClient } from './httpClient';

export function createGrantsServiceHttp(client: HttpClient): InterGrantsService {
  return {
    async snapshot(): Promise<GrantsSnapshot> {
      const [menu, batch] = await Promise.all([
        client.request<{ items: MenuItem[] }>('GET', '/menu'),
        client.request<Record<string, unknown>>('GET', '/forms/permissions'),
      ]);
      // Fail closed: whatever the wire carries, only a literal `true` grants an action.
      return { menu: menu.items, permissions: Object.fromEntries(Object.entries(batch).map(([formId, flags]) => [formId, parsePermissions(flags)])) };
    },
  };
}
