import type { InterLookupService, LookupItem } from './InterLookupService';
import type { HttpClient } from './httpClient';

export function createLookupServiceHttp(client: HttpClient): InterLookupService {
  const items = async (path: string, query?: Record<string, string | undefined>) =>
    (await client.request<{ items: LookupItem[] }>('GET', path, { query })).items;
  return {
    empresas: () => items('/v1/empresas'),
    ubigeoChildren: (parent) => items('/v1/ubigeo', { parent }),
  };
}
