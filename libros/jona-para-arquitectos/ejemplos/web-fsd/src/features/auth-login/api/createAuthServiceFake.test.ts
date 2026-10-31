import { describe, expect, it } from 'vitest';
import { ApiError } from '../../../shared/api';
import { describeAuthServiceContract } from './authServiceContract';
import { createAuthServiceFake, type Escenario } from './createAuthServiceFake';

describeAuthServiceContract('AuthServiceFake', () => createAuthServiceFake());

describe('AuthServiceFake: escenarios (los mismos que el servidor mock)', () => {
  it.each<[Escenario, number, string]>([
    ['credencialesInvalidas', 401, 'INVALID_CREDENTIALS'],
    ['usuarioBloqueado', 403, 'USER_DISABLED'],
    ['errorServidor', 500, 'INTERNAL_ERROR'],
  ])('%s rechaza con %i %s aun con credenciales válidas', async (escenario, status, code) => {
    const error = await createAuthServiceFake({ escenario }).login('ana@ejemplo.com', 'secreta123').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status, code });
  });
});
