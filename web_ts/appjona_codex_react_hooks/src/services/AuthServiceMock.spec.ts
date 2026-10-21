import { describe, expect, it } from 'vitest';
import { createAuthServiceMock } from './AuthServiceMock';
import { exitosoFixture } from './fixtures/auth/exitoso.fixture';
import { credencialesInvalidasFixture } from './fixtures/auth/credencialesInvalidas.fixture';
import { errorServidorFixture } from './fixtures/auth/errorServidor.fixture';

describe('createAuthServiceMock', () => {
  it('escenario exitoso resuelve la sesion del fixture', async () => {
    const service = createAuthServiceMock('exitoso', 0);

    await expect(service.login('cualquiera@jona.dev', 'x')).resolves.toEqual(exitosoFixture);
  });

  it('escenario credencialesInvalidas rechaza con el mensaje del fixture', async () => {
    const service = createAuthServiceMock('credencialesInvalidas', 0);

    await expect(service.login('a@jona.dev', 'x')).rejects.toThrow(
      credencialesInvalidasFixture.message,
    );
  });

  it('escenario errorServidor rechaza con el mensaje del fixture', async () => {
    const service = createAuthServiceMock('errorServidor', 0);

    await expect(service.login('a@jona.dev', 'x')).rejects.toThrow(errorServidorFixture.message);
  });
});
