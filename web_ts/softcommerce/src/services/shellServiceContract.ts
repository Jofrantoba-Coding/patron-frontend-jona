import { describe, expect, it } from 'vitest';
import { ApiError } from './ApiError';
import type { InterShellService } from './InterShellService';
import type { SessionContext } from './httpClient';
import { PERMISSION_FLAGS } from '../domain/permissions';

/** Builds the implementation under test, reading the session from `getSession`. */
export type ShellServiceFactory = (getSession: () => SessionContext) => InterShellService;

/**
 * Behavior both implementations must share (dual-source parity): the http client
 * against the live mock server and the in-browser mock run exactly these cases.
 */
export function describeShellServiceContract(label: string, make: ShellServiceFactory): void {
  describe(`InterShellService contract: ${label}`, () => {
    const inTenant = (tenantId?: string) => make(() => ({ tenantId }));

    it('returns the flat menu list from the seed with the MenuDinamico columns', async () => {
      const items = await inTenant('demo').menu();

      expect(items.map((m) => m.id_menu)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect(items[2]).toEqual({
        id_menu: 3,
        id_menu_padre: 2,
        menu_item: 'S',
        descripcion: 'Localidad',
        nombre: 'mi_localidad',
      });
      expect(items[0].id_menu_padre).toBeNull();
    });

    it('returns the 13 permission flags of a seeded form, differing per form', async () => {
      const service = inTenant('demo');

      const localidad = await service.permissions('mi_localidad');
      const stub = await service.permissions('demo_stub');

      expect(Object.keys(localidad)).toEqual([...PERMISSION_FLAGS]);
      expect(localidad).toMatchObject({ add: true, eliminate: true, clone: true, export: false });
      expect(stub).toMatchObject({ add: true, eliminate: false, clone: false });
    });

    it('denies every flag for an unknown form', async () => {
      const unknown = await inTenant('demo').permissions('no_such_form');

      expect(Object.keys(unknown)).toHaveLength(13);
      expect(Object.values(unknown).every((flag) => flag === false)).toBe(true);
    });

    it.each(['menu', 'permissions'] as const)(
      '%s rejects without a tenant (400) or with an unknown one (404)',
      async (method) => {
        const call = (tenantId?: string) =>
          (method === 'menu' ? inTenant(tenantId).menu() : inTenant(tenantId).permissions('mi_localidad')).then(
            () => undefined,
            (e: unknown) => e,
          );

        const missing = await call();
        const unknown = await call('nope');

        expect(missing).toBeInstanceOf(ApiError);
        expect(missing).toMatchObject({ status: 400, code: 'TENANT_REQUIRED' });
        expect(unknown).toMatchObject({ status: 404, code: 'TENANT_NOT_FOUND' });
      },
    );
  });
}
