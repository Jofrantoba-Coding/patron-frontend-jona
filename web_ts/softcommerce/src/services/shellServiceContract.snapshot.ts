import { describe, expect, it } from 'vitest';
import menuSeed from '../../mock-server/data/menu.json';
import permissionsSeed from '../../mock-server/data/permissions.json';
import { PERMISSION_FLAGS } from '../domain/permissions';
import type { InterGrantsService } from './InterGrantsService';
import type { RequestContext, SessionContext } from './httpClient';
import { seed } from './mock/seed';

const ADUANA = menuSeed.find((m) => m.nombre === 'miAduana')!.id_menu;

/**
 * The shared seed plus one user of perfil 1 (through trabajador 001) whose perfil unchecked `Aduana` and the `eliminate` flag of `miColor`
 * (R-AUTH-11): the same data feeds the live server and the in-browser mock.
 */
export const grantsSeed = {
  ...seed,
  users: [
    ...seed.users,
    { id_usuario: 10, usuario: 'perfilado', clave: 'perfil123', nombre: 'Perfilado', flaghabilitado: 'A', flagEscritorio: 'S', id_trabajador: '001', tenants: ['demo'] },
  ],
  'perfil-overrides': {
    demo: [
      { id_tipo_perfil: '1', kind: 'menu', key: String(ADUANA), value: false },
      { id_tipo_perfil: '1', kind: 'form', key: 'miColor', flag: 'eliminate', value: false },
    ],
  },
};

export type GrantsServiceFactory = (getSession: () => SessionContext, getRequestContext: () => RequestContext) => InterGrantsService;

/** Behavior both implementations of the login snapshot share (S-AUTH-16, S-AUTH-27, S-MOCK-58). */
export function describeGrantsServiceContract(label: string, make: GrantsServiceFactory): void {
  describe(`InterGrantsService contract: ${label}`, () => {
    const as = (userId?: string, tenantId: string | undefined = 'demo') => make(() => ({ tenantId }), () => ({ userId }));

    it('S-AUTH-27 gives a seeded user the seeded menu and the flags of every form', async () => {
      const snapshot = await as('1').snapshot();

      expect(snapshot.menu).toEqual(menuSeed);
      expect(Object.keys(snapshot.permissions)).toEqual(Object.keys(permissionsSeed));
      expect(snapshot.permissions.miColor).toMatchObject({ eliminate: true, add: true });
      expect(Object.keys(snapshot.permissions.miColor)).toEqual([...PERMISSION_FLAGS]);
    });

    it('with no user header it is the seeded defaults too', async () => {
      const snapshot = await as(undefined).snapshot();

      expect(snapshot.menu).toEqual(menuSeed);
      expect(snapshot.permissions.miColor.eliminate).toBe(true);
    });

    it('S-AUTH-16 gives a user of an edited perfil its own menu and flags, covering forms never opened', async () => {
      const snapshot = await as('10').snapshot();

      expect(snapshot.menu.map((m) => m.nombre)).not.toContain('miAduana');
      expect(snapshot.menu.map((m) => m.nombre)).toContain('miColor');
      expect(snapshot.permissions.miColor).toMatchObject({ eliminate: false, add: true });
      expect(Object.keys(snapshot.permissions)).toEqual(Object.keys(permissionsSeed));
    });

    it('rejects without a tenant (400) and with an unknown one (404)', async () => {
      expect(await as('1', '').snapshot().catch((e: unknown) => e)).toMatchObject({ status: 400 });
      expect(await as('1', 'nope').snapshot().catch((e: unknown) => e)).toMatchObject({ status: 404 });
    });
  });
}
