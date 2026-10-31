import { ApiError, type ApiErrorDetail } from '../../../shared/api';
import type { InterAuthService } from '../model/InterAuthService';

/** Los mismos escenarios que el servidor mock selecciona con X-Mock-Scenario. */
export type Escenario = 'exitoso' | 'credencialesInvalidas' | 'usuarioBloqueado' | 'errorServidor';

/** Datos de prueba del contrato de API (iguales a los del servidor mock). */
const USERS = [
  { id: 1, usuario: 'ana@ejemplo.com', clave: 'secreta123', nombre: 'Ana Torres', bloqueado: false },
  { id: 2, usuario: 'bloqueado@ejemplo.com', clave: 'secreta123', nombre: 'Usuario Bloqueado', bloqueado: true },
];

const FAILURES: Record<Exclude<Escenario, 'exitoso'>, [number, string, string]> = {
  credencialesInvalidas: [401, 'INVALID_CREDENTIALS', 'Usuario o clave incorrectos.'],
  usuarioBloqueado: [403, 'USER_DISABLED', 'El usuario está bloqueado.'],
  errorServidor: [500, 'INTERNAL_ERROR', 'Error interno del servidor.'],
};

/** Servicio falso en memoria: también es un adaptador del puerto, sin red (punto de sustitución 2). */
export function createAuthServiceFake({ escenario = 'exitoso' }: { escenario?: Escenario } = {}): InterAuthService {
  let requests = 0;
  const fail = (status: number, code: string, message: string, details: ApiErrorDetail[] = []) =>
    new ApiError(status, { code, message, details, traceId: `fake-${++requests}` });

  return {
    async login(email, password) {
      const details = Object.entries({ usuario: email, clave: password })
        .filter(([, value]) => value === '')
        .map(([field]) => ({ field, message: 'Es obligatorio.' }));
      if (details.length > 0) throw fail(422, 'VALIDATION_ERROR', 'La petición no es válida.', details);

      if (escenario !== 'exitoso') throw fail(...FAILURES[escenario]);

      const user = USERS.find((u) => u.usuario === email && u.clave === password);
      if (!user) throw fail(...FAILURES.credencialesInvalidas);
      if (user.bloqueado) throw fail(...FAILURES.usuarioBloqueado);

      requests += 1;
      return { token: `fake-token-${user.id}-${requests}`, user: { id: user.id, usuario: user.usuario, nombre: user.nombre } };
    },
  };
}
