// Violación: la Implementación importa el adaptador en lugar de recibir el puerto.
import { createAuthServiceHttp } from '../api/createAuthServiceHttp';

export const service = createAuthServiceHttp({ baseUrl: 'http://127.0.0.1:4010' });
