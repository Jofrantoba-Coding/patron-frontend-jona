import { describe, expect, it } from 'vitest';
import { ApiError } from './ApiError';
import type { InterAuthService } from './InterAuthService';
import type { SessionContext } from './httpClient';

/** Builds the implementation under test, reading the session from `getSession`. */
export type AuthServiceFactory = (getSession: () => SessionContext) => InterAuthService;

async function rejection(promise: Promise<unknown>): Promise<ApiError> {
  const error = await promise.then(
    () => undefined,
    (e: unknown) => e,
  );
  expect(error).toBeInstanceOf(ApiError);
  return error as ApiError;
}

/**
 * Behavior both implementations must share (dual-source parity): the http client
 * against the live mock server and the in-browser mock run exactly these cases.
 */
export function describeAuthServiceContract(label: string, make: AuthServiceFactory): void {
  describe(`InterAuthService contract: ${label}`, () => {
    const inTenant = (tenantId?: string) => make(() => ({ tenantId }));

    it('lists the tenants for the login screen without a session', async () => {
      const tenants = await inTenant().sessionOptions();

      expect(tenants).toEqual([
        { id: 'demo', name: 'Comercial Demo SAC' },
        { id: 'botica', name: 'Botica Salud EIRL' },
      ]);
    });

    it('logs in with the explicit tenant and returns token and user', async () => {
      const service = inTenant();

      const demo = await service.login('demo', { usuario: 'cajero', clave: 'cajero123' });
      const botica = await service.login('botica', { usuario: 'admin', clave: 'admin123' });

      expect(demo.user).toEqual({ id_usuario: 2, usuario: 'cajero', nombre: 'Cajero Uno' });
      expect(demo.token).toBe('mock-token-2-demo');
      expect(botica.user.usuario).toBe('admin');
      expect(botica.token).toBe('mock-token-1-botica');
    });

    it.each([
      ['wrong password', 'demo', 'admin', 'nope', 401, 'INVALID_CREDENTIALS'],
      ['user outside the tenant', 'botica', 'cajero', 'cajero123', 401, 'INVALID_CREDENTIALS'],
      ['disabled user', 'demo', 'bloqueado', 'bloq123', 403, 'USER_DISABLED'],
      ['no desktop access', 'demo', 'soloweb', 'web123', 403, 'NO_DESKTOP_ACCESS'],
    ])('rejects %s with ApiError and a traceId', async (_name, tenant, usuario, clave, status, code) => {
      const error = await rejection(inTenant().login(tenant, { usuario, clave }));

      expect(error).toMatchObject({ status, code });
      expect(error.message).not.toBe('');
      expect(error.traceId).not.toBe('');
      expect(error.details).toEqual([]);
    });

    it('lists the empresas of the session tenant', async () => {
      const demo = await inTenant('demo').empresas();
      const botica = await inTenant('botica').empresas();

      expect(demo.map((e) => e.name)).toEqual(['COMERCIAL DEMO SAC', 'DISTRIBUIDORA DEMO SRL']);
      expect(botica.map((e) => e.name)).toEqual(['BOTICA SALUD EIRL']);
    });

    it('filters puntos de venta by empresa, and lists all without a filter', async () => {
      const service = inTenant('demo');

      const empresa1 = await service.puntosVenta('1');
      const empresa2 = await service.puntosVenta('2');
      const all = await service.puntosVenta();

      expect(empresa1.map((p) => p.name)).toEqual(['TIENDA CENTRAL', 'TIENDA MIRAFLORES']);
      expect(empresa2.map((p) => p.name)).toEqual(['ALMACEN SUR']);
      expect(all).toHaveLength(3);
    });

    it('returns the params flags of the session tenant', async () => {
      const demo = await inTenant('demo').params();
      const botica = await inTenant('botica').params();

      expect(demo).toMatchObject({ INICIO_ACTIVIDADES: '2020-01-01', ISBOTICA: false });
      expect(botica).toMatchObject({ INICIO_ACTIVIDADES: '2022-03-01', ISBOTICA: true });
    });

    it('rejects post-login calls without a tenant (400) or with an unknown one (404)', async () => {
      const missing = await rejection(inTenant().empresas());
      const unknown = await rejection(inTenant('nope').empresas());

      expect(missing).toMatchObject({ status: 400, code: 'TENANT_REQUIRED' });
      expect(unknown).toMatchObject({ status: 404, code: 'TENANT_NOT_FOUND' });
    });
  });
}
