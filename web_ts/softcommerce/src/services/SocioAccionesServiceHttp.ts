import type { InterSocioAccionesService, SocioAcciones } from './InterSocioAccionesService';
import type { HttpClient } from './httpClient';

const PATH = '/v1/socio-acciones';

export function createSocioAccionesServiceHttp(client: HttpClient): InterSocioAccionesService {
  return {
    load: () => client.request<SocioAcciones>('GET', PATH),
    save: (body) => client.request<SocioAcciones & { message: string }>('PUT', PATH, { body }),
  };
}
