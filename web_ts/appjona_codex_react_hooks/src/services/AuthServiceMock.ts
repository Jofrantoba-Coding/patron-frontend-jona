// Capa: Service (mock)
// Responsabilidad: implementar InterAuthService respondiendo segun el escenario declarado.
// Restricciones: sin logica de credenciales; la respuesta la decide el fixture.
import type { AuthScenario, AuthSession, InterAuthService } from './InterAuthService';
import { exitosoFixture } from './fixtures/auth/exitoso.fixture';
import { credencialesInvalidasFixture } from './fixtures/auth/credencialesInvalidas.fixture';
import { errorServidorFixture } from './fixtures/auth/errorServidor.fixture';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function createAuthServiceMock(
  scenario: AuthScenario,
  delayMs = 500,
): InterAuthService {
  return {
    async login(): Promise<AuthSession> {
      await sleep(delayMs);

      switch (scenario) {
        case 'exitoso':
          return exitosoFixture;
        case 'credencialesInvalidas':
          throw new Error(credencialesInvalidasFixture.message);
        case 'errorServidor':
          throw new Error(errorServidorFixture.message);
      }
    },
  };
}
