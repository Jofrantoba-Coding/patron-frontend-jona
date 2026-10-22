import type { MenuItem } from '../domain/menuTree';
import { parsePermissions } from '../domain/permissions';
import type { InterShellService } from './InterShellService';
import type { HttpClient } from './httpClient';

export function createShellServiceHttp(client: HttpClient): InterShellService {
  return {
    menu: async () => (await client.request<{ items: MenuItem[] }>('GET', '/menu')).items,
    // Fail closed: whatever the wire carries, only a literal `true` grants an action.
    permissions: async (formId) =>
      parsePermissions(await client.request<unknown>('GET', `/forms/${encodeURIComponent(formId)}/permissions`)),
  };
}
