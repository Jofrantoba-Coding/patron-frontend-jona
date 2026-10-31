// Sin violación: app sí puede elegir el adaptador.
import { createAuthServiceHttp } from '../features/auth-login';

export const service = createAuthServiceHttp({ baseUrl: 'http://127.0.0.1:4010' });
