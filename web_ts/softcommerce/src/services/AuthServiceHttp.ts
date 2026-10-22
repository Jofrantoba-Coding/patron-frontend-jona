import type { AppParams, Empresa, InterAuthService, LoginResult, PuntoVenta, Tenant } from './InterAuthService';
import type { HttpClient } from './httpClient';

interface Items<T> {
  items: T[];
}

export function createAuthServiceHttp(client: HttpClient): InterAuthService {
  return {
    sessionOptions: async () => (await client.request<Items<Tenant>>('GET', '/auth/session-options')).items,
    login: (tenantId, { usuario, clave }) =>
      client.request<LoginResult>('POST', '/auth/login', { tenantId, body: { usuario, clave } }),
    empresas: async () => (await client.request<Items<Empresa>>('GET', '/v1/empresas')).items,
    puntosVenta: async (idEmpresa) =>
      (await client.request<Items<PuntoVenta>>('GET', '/v1/puntos-venta', { query: { id_empresa: idEmpresa } })).items,
    params: () => client.request<AppParams>('GET', '/v1/params'),
  };
}
