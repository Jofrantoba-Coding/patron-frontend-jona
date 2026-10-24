import type { InterActionService } from './InterActionService';
import type { HttpClient } from './httpClient';

export function createActionServiceHttp(client: HttpClient, catalog: string): InterActionService {
  const enc = encodeURIComponent;
  return {
    run: (target, action, input = {}) =>
      client.request('POST', `/v1/${enc(catalog)}/${enc(target.id)}${target.child === undefined ? '' : `/${enc(target.child)}`}${target.childId === undefined ? '' : `/${enc(target.childId)}`}/actions/${enc(action)}`, {
        body: input,
      }),
  };
}
