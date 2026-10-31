import { describe, expect, it } from 'vitest';
import { ApiError } from '../../../shared/api';
import type { InterAuthService } from '../model/InterAuthService';

/** Construye la implementación bajo prueba. */
export type AuthServiceFactory = () => InterAuthService;

async function rejection(promise: Promise<unknown>): Promise<ApiError> {
  const error = await promise.then(
    () => undefined,
    (e: unknown) => e,
  );
  expect(error).toBeInstanceOf(ApiError);
  return error as ApiError;
}

/**
 * Casos que toda implementación de InterAuthService debe cumplir (paridad de doble fuente):
 * el servicio falso y el adaptador HTTP contra el servidor mock (o un backend real)
 * ejecutan exactamente estos casos, con los datos de prueba del contrato de API.
 */
export function describeAuthServiceContract(label: string, make: AuthServiceFactory): void {
  describe(`Contrato de InterAuthService: ${label}`, () => {
    it('devuelve el token y el usuario con credenciales válidas', async () => {
      const result = await make().login('ana@ejemplo.com', 'secreta123');

      expect(result.user).toEqual({ id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' });
      expect(result.token).toBeTypeOf('string');
      expect(result.token.length).toBeGreaterThan(0);
    });

    it.each([
      ['una clave incorrecta', 'ana@ejemplo.com', 'otra', 401, 'INVALID_CREDENTIALS'],
      ['un usuario desconocido', 'nadie@ejemplo.com', 'secreta123', 401, 'INVALID_CREDENTIALS'],
      ['un usuario bloqueado', 'bloqueado@ejemplo.com', 'secreta123', 403, 'USER_DISABLED'],
    ])('rechaza %s con ApiError y un traceId', async (_name, email, password, status, code) => {
      const error = await rejection(make().login(email, password));

      expect(error).toMatchObject({ status, code, details: [] });
      expect(error.message).not.toBe('');
      expect(error.traceId).not.toBe('');
    });

    it('rechaza campos vacíos con 422 y un detalle por campo', async () => {
      const error = await rejection(make().login('', ''));

      expect(error).toMatchObject({ status: 422, code: 'VALIDATION_ERROR' });
      expect(error.details.map((d) => d.field)).toEqual(['usuario', 'clave']);
    });
  });
}
