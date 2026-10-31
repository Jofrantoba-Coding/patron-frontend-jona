import { ApiError } from './ApiError.js';
import type { InterAuthService } from './InterAuthService.js';

/** Datos de prueba del contrato de API (iguales a los del servidor mock). */
const USERS = [
  { id: 1, usuario: 'ana@ejemplo.com', clave: 'secreta123', nombre: 'Ana Torres', bloqueado: false },
  { id: 2, usuario: 'bloqueado@ejemplo.com', clave: 'secreta123', nombre: 'Usuario Bloqueado', bloqueado: true },
];

/** Servicio falso en memoria: permite trabajar y probar la pantalla sin backend. */
export function createAuthServiceFake(): InterAuthService {
  let requests = 0;
  const fail = (status: number, code: string, message: string, empty: string[] = []) =>
    new ApiError(status, {
      code, message, traceId: `fake-${++requests}`,
      details: empty.map((field) => ({ field, message: 'Es obligatorio.' })),
    });

  return {
    async login(email, password) {
      const empty = Object.entries({ email, password }).filter(([, value]) => value === '').map(([field]) => field);
      if (empty.length > 0) throw fail(422, 'VALIDATION_ERROR', 'La petición no es válida.', empty);
      const user = USERS.find((u) => u.usuario === email && u.clave === password);
      if (!user) throw fail(401, 'INVALID_CREDENTIALS', 'Usuario o clave incorrectos.');
      if (user.bloqueado) throw fail(403, 'USER_DISABLED', 'El usuario está bloqueado.');

      requests += 1;
      return { token: `fake-token-${user.id}-${requests}`, user: { id: user.id, usuario: user.usuario, nombre: user.nombre } };
    },
  };
}
