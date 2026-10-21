import { afterEach, describe, expect, it, vi } from 'vitest';
import { composeAuthService } from './authServiceComposer';
import { exitosoFixture } from './fixtures/auth/exitoso.fixture';
import { errorServidorFixture } from './fixtures/auth/errorServidor.fixture';

describe('composeAuthService', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('sin configuracion compone mock con escenario exitoso', async () => {
    vi.useFakeTimers();
    const service = composeAuthService({});

    const pending = service.login('a@jona.dev', 'x');
    // El mock se carga con import() dinamico: esperar la carga antes de avanzar timers.
    await vi.dynamicImportSettled();
    await vi.runAllTimersAsync();

    await expect(pending).resolves.toEqual(exitosoFixture);
  });

  it('mode mock con escenario errorServidor rechaza', async () => {
    vi.useFakeTimers();
    const service = composeAuthService({ mode: 'mock', scenario: 'errorServidor' });

    const pending = service.login('a@jona.dev', 'x');
    const assertion = expect(pending).rejects.toThrow(errorServidorFixture.message);
    await vi.dynamicImportSettled();
    await vi.runAllTimersAsync();

    await assertion;
  });

  it('mode real con apiUrl usa la implementacion http', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify(exitosoFixture), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const service = composeAuthService({ mode: 'real', apiUrl: 'https://api.jona.dev' });

    await expect(service.login('a@jona.dev', 'x')).resolves.toEqual(exitosoFixture);
    expect(fetchMock).toHaveBeenCalledWith('https://api.jona.dev/auth/login', expect.anything());
  });

  it('mode desconocido lanza error nombrando el valor', () => {
    expect(() => composeAuthService({ mode: 'staging' })).toThrow(/staging/);
  });

  it('escenario desconocido lanza error nombrando el valor', () => {
    expect(() => composeAuthService({ mode: 'mock', scenario: 'timeout' })).toThrow(/timeout/);
  });

  it('escenario desconocido lanza error aunque el mode sea real', () => {
    expect(() =>
      composeAuthService({ mode: 'real', scenario: 'timeout', apiUrl: 'https://api.jona.dev' }),
    ).toThrow(/timeout/);
  });

  it('mode real sin apiUrl lanza error', () => {
    expect(() => composeAuthService({ mode: 'real' })).toThrow(/VITE_AUTH_API_URL/);
  });
});
