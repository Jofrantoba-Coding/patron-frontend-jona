import type { InterChildService } from './InterChildService';
import type { HttpClient } from './httpClient';

export function createChildServiceHttp(client: HttpClient, catalog: string): InterChildService {
  const path = (parentId: string, child: string, id?: string) =>
    `/v1/${encodeURIComponent(catalog)}/${encodeURIComponent(parentId)}/${encodeURIComponent(child)}${id === undefined ? '' : `/${encodeURIComponent(id)}`}`;

  return {
    list: (parentId, child, { page, pageSize, filters } = {}) =>
      client.request('GET', path(parentId, child), { query: { page: page?.toString(), pageSize: pageSize?.toString(), ...filters } }),
    get: (parentId, child, id) => client.request('GET', path(parentId, child, id)),
    create: (parentId, child, values) => client.request('POST', path(parentId, child), { body: values }),
    update: (parentId, child, id, values) => client.request('PUT', path(parentId, child, id), { body: values }),
    remove: async (parentId, child, id) => {
      await client.request('DELETE', path(parentId, child, id));
    },
  };
}
