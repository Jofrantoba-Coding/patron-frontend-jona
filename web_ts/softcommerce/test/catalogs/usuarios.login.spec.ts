import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { ApiError } from '../../src/services/ApiError';
import { createAuthServiceHttp } from '../../src/services/AuthServiceHttp';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import type { InterAuthService } from '../../src/services/InterAuthService';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';

/**
 * The login connected to the Usuario master (R-AUTH-10, S-AUTH-23, S-AUTH-25, S-AUTH-27..29): one store, one compare path over the hashed password. Both transports run
 * the same table.
 */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
type World = { users: InterCatalogService<Record<string, any>>; auth: InterAuthService };
const NEW = { id_trabajador: '001', usuario: 'nuevo', clave: 'secreto1', clave_confirmacion: 'secreto1' };
const ON = { habilitado: true, escritorio: true };

const failure = async (promise: Promise<unknown>): Promise<ApiError> => {
  try {
    await promise;
  } catch (e) {
    return e as ApiError;
  }
  throw new Error('expected the call to fail');
};
const rejected = async (world: World, usuario: string, clave: string, tenant = 'demo') => {
  const error = await failure(world.auth.login(tenant, { usuario, clave }));
  return [error.status, error.code];
};
const INVALID = [401, 'INVALID_CREDENTIALS'];

function describeLogin(label: string, make: () => World): void {
  describe(`usuarios login: ${label}`, () => {
    it('S-AUTH-23 a created user with Habilitado and Escritorio ticked logs in with its password, in its tenant only', async () => {
      const world = make();
      await world.users.create({ ...NEW, ...ON });
      const session = await world.auth.login('demo', { usuario: 'nuevo', clave: 'secreto1' });
      expect(session.user).toEqual({ id_usuario: 5, usuario: 'nuevo', nombre: 'JUAN PEREZ LOPEZ' });
      expect(session.token).toBe('mock-token-5-demo');
      expect(await rejected(world, 'nuevo', 'otra-clave')).toEqual(INVALID);
      expect(await rejected(world, 'nuevo', 'secreto1', 'botica')).toEqual(INVALID);
    });

    it('S-AUTH-23 a user created with the defaults (both unticked) is "user disabled" once the credentials are right', async () => {
      const world = make();
      await world.users.create(NEW);
      expect(await rejected(world, 'nuevo', 'secreto1')).toEqual([403, 'USER_DISABLED']);
      expect(await rejected(world, 'nuevo', 'mal')).toEqual(INVALID);
    });

    it('S-AUTH-25 unticking Habilitado gives "user disabled" at the next login; Habilitado on and Escritorio off gives "no desktop access"', async () => {
      const world = make();
      const created = await world.users.create({ ...NEW, ...ON });
      await world.auth.login('demo', { usuario: 'nuevo', clave: 'secreto1' });
      await world.users.update(created.id_usuario, { habilitado: false });
      expect(await rejected(world, 'nuevo', 'secreto1')).toEqual([403, 'USER_DISABLED']);
      await world.users.update(created.id_usuario, { habilitado: true, escritorio: false });
      expect(await rejected(world, 'nuevo', 'secreto1')).toEqual([403, 'NO_DESKTOP_ACCESS']);
      await world.users.update(created.id_usuario, { escritorio: true });
      expect((await world.auth.login('demo', { usuario: 'nuevo', clave: 'secreto1' })).user.usuario).toBe('nuevo');
    });

    it('S-AUTH-27 the seeded users keep logging in, also after the master wrote other users', async () => {
      const world = make();
      await world.users.create({ ...NEW, ...ON });
      expect((await world.auth.login('demo', { usuario: 'admin', clave: 'admin123' })).user).toEqual({ id_usuario: 1, usuario: 'admin', nombre: 'Administrador' });
      expect((await world.auth.login('demo', { usuario: 'cajero', clave: 'cajero123' })).token).toBe('mock-token-2-demo');
      expect(await rejected(world, 'bloqueado', 'bloq123')).toEqual([403, 'USER_DISABLED']);
    });

    it('S-AUTH-27 editing a seeded user in the master keeps its password and its access', async () => {
      const world = make();
      await world.users.update('2', { id_trabajador: '001', usuario: 'cajero' });
      expect((await world.auth.login('demo', { usuario: 'cajero', clave: 'cajero123' })).user.id_usuario).toBe(2);
    });

    it('S-AUTH-28 a logically deleted user gets the generic invalid credentials and leaves the list', async () => {
      const world = make();
      const created = await world.users.create({ ...NEW, ...ON });
      await world.users.remove(created.id_usuario);
      expect(await rejected(world, 'nuevo', 'secreto1')).toEqual(INVALID);
      expect((await world.users.list({})).items.map((u) => u.usuario)).not.toContain('nuevo');
    });

    it('S-AUTH-29 a new password replaces the old one, and a blank one keeps it', async () => {
      const world = make();
      const created = await world.users.create({ ...NEW, ...ON });
      await world.users.update(created.id_usuario, { clave: '', clave_confirmacion: '' });
      expect((await world.auth.login('demo', { usuario: 'nuevo', clave: 'secreto1' })).user.usuario).toBe('nuevo');
      await world.users.update(created.id_usuario, { clave: 'otra-clave', clave_confirmacion: 'otra-clave' });
      expect(await rejected(world, 'nuevo', 'secreto1')).toEqual(INVALID);
      expect((await world.auth.login('demo', { usuario: 'nuevo', clave: 'otra-clave' })).user.usuario).toBe('nuevo');
    });

    it('S-AUTH-29 an edited user name replaces the old one', async () => {
      const world = make();
      const created = await world.users.create({ ...NEW, ...ON });
      await world.users.update(created.id_usuario, { usuario: 'renombrado' });
      expect(await rejected(world, 'nuevo', 'secreto1')).toEqual(INVALID);
      expect((await world.auth.login('demo', { usuario: 'renombrado', clave: 'secreto1' })).user.usuario).toBe('renombrado');
    });

    it('two users with the same password hash differently: one password never opens the other account', async () => {
      const world = make();
      await world.users.create({ ...NEW, ...ON, usuario: 'uno', clave: 'igual', clave_confirmacion: 'igual' });
      await world.users.create({ ...NEW, ...ON, usuario: 'dos', clave: 'igual', clave_confirmacion: 'igual' });
      expect((await world.auth.login('demo', { usuario: 'uno', clave: 'igual' })).user.id_usuario).toBe(5);
      expect((await world.auth.login('demo', { usuario: 'dos', clave: 'igual' })).user.id_usuario).toBe(6);
    });
  });
}

describeLogin('in-browser mock', () => {
  const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({}), delayMs: 0 });
  return { users: mock.catalog('usuarios'), auth: mock.auth };
});

const server = useTestServer({ seed: loadSeed(dataDir) });
describeLogin('http mock server', () => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({}) });
  return { users: createCatalogServiceHttp(client, 'usuarios'), auth: createAuthServiceHttp(client) };
});
