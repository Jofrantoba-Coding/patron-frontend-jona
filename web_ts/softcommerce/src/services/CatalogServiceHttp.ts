import type { InterCatalogService, ListQuery, Page } from './InterCatalogService';
import type { HttpClient } from './httpClient';

export function createCatalogServiceHttp<T>(client: HttpClient, catalog: string): InterCatalogService<T> {
  const base = `/v1/${encodeURIComponent(catalog)}`;
  const item = (id: string) => `${base}/${encodeURIComponent(id)}`;

  return {
    list: ({ page, pageSize, filters }: ListQuery = {}) =>
      client.request<Page<T>>('GET', base, {
        query: { page: page?.toString(), pageSize: pageSize?.toString(), ...filters },
      }),
    get: (id) => client.request<T>('GET', item(id)),
    create: (values) => client.request<T>('POST', base, { body: values }),
    update: (id, values) => client.request<T>('PUT', item(id), { body: values }),
    remove: async (id) => {
      await client.request('DELETE', item(id));
    },
  };
}
