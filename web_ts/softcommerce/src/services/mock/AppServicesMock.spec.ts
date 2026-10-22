import { describe, expect, it } from 'vitest';
import { ApiError } from '../ApiError';
import { describeAuthServiceContract } from '../authServiceContract';
import { describeShellServiceContract } from '../shellServiceContract';
import { createAppServicesMock } from './AppServicesMock';

const mockAuth = (scenario: 'exitoso' | 'vacio' | 'errorServidor', tenantId?: string) =>
  createAppServicesMock(scenario, { getSession: () => ({ tenantId }), delayMs: 0 }).auth;

// Same cases the http implementation runs against the live server: dual-source parity.
describeAuthServiceContract('AppServicesMock exitoso', (getSession) =>
  createAppServicesMock('exitoso', { getSession, delayMs: 0 }).auth,
);

describeShellServiceContract('AppServicesMock exitoso', (getSession) =>
  createAppServicesMock('exitoso', { getSession, delayMs: 0 }).shell,
);

describe('AppServicesMock shell scenarios', () => {
  const mockShell = (scenario: 'vacio' | 'errorServidor') =>
    createAppServicesMock(scenario, { getSession: () => ({ tenantId: 'demo' }), delayMs: 0 }).shell;

  it('vacio keeps the menu and permissions (only catalogs and lookups are emptied)', async () => {
    const shell = mockShell('vacio');

    expect((await shell.menu()).length).toBe(7);
    expect((await shell.permissions('mi_localidad')).add).toBe(true);
  });

  it('errorServidor rejects menu and permissions with ApiError 500 and a traceId', async () => {
    const shell = mockShell('errorServidor');

    for (const error of [await shell.menu().catch((e: unknown) => e), await shell.permissions('x').catch((e: unknown) => e)]) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 500, code: 'INTERNAL_ERROR' });
      expect((error as ApiError).traceId).not.toBe('');
    }
  });
});

describe('AppServicesMock scenario vacio', () => {
  it('returns empty catalogs but still serves tenants and login', async () => {
    const service = mockAuth('vacio', 'demo');

    await expect(service.empresas()).resolves.toEqual([]);
    await expect(service.puntosVenta()).resolves.toEqual([]);
    expect((await service.sessionOptions()).length).toBe(2);
    await expect(service.login('demo', { usuario: 'admin', clave: 'admin123' })).resolves.toMatchObject({
      user: { usuario: 'admin' },
    });
  });
});

describe('AppServicesMock scenario errorServidor', () => {
  it.each(['sessionOptions', 'empresas', 'puntosVenta', 'params'] as const)(
    '%s rejects ApiError 500 with a traceId',
    async (method) => {
      const error = await mockAuth('errorServidor', 'demo')[method]().catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 500, code: 'INTERNAL_ERROR' });
      expect((error as ApiError).traceId).not.toBe('');
    },
  );

  it('login rejects ApiError 500 even with valid credentials', async () => {
    const error = await mockAuth('errorServidor')
      .login('demo', { usuario: 'admin', clave: 'admin123' })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500 });
  });
});
