import { describe, expect, it } from 'vitest';
import menuSeed from '../../mock-server/data/menu.json';
import permissionsSeed from '../../mock-server/data/permissions.json';
import { PERMISSION_FLAGS } from '../domain/permissions';
import type { InterPerfilGrantsService } from './InterPerfilGrantsService';
import type { SessionContext } from './httpClient';
import { grantsSeed } from './shellServiceContract.snapshot';

/** The grants seed: perfil `1` has `Aduana` unchecked, perfil `2` has no overrides. */
export const perfilGrantsSeed = grantsSeed;

export type PerfilGrantsServiceFactory = (getSession: () => SessionContext) => InterPerfilGrantsService;

const ADUANA = menuSeed.find((m) => m.nombre === 'miAduana')!.id_menu;
const COLOR = menuSeed.find((m) => m.nombre === 'miColor')!.id_menu;

/** Behavior both implementations of the perfil editor client share (S-PRM-4, S-PRM-9, R-PRM-5). */
export function describePerfilGrantsServiceContract(label: string, make: PerfilGrantsServiceFactory): void {
  describe(`InterPerfilGrantsService contract: ${label}`, () => {
    const service = (tenantId: string | undefined = 'demo') => make(() => ({ tenantId }));

    it('reads the seeded menu with the visibility of the perfil (no override = visible)', async () => {
      const items = await service().menu('1');

      expect(items.map(({ visible: _visible, ...node }) => node)).toEqual(menuSeed);
      expect(items.find((n) => n.id_menu === ADUANA)?.visible).toBe(false);
      expect(items.find((n) => n.id_menu === COLOR)?.visible).toBe(true);
      expect((await service().menu('2')).every((n) => n.visible)).toBe(true);
    });

    it('S-PRM-4 stores only the changed nodes, answers the stored menu and does not cascade to children', async () => {
      const parent = menuSeed.find((m) => m.menu_item === 'N' && menuSeed.some((c) => c.id_menu_padre === m.id_menu))!.id_menu;
      const svc = service();
      const items = await svc.saveMenu('2', [{ id: parent, visible: false }, { id: COLOR, visible: false }]);

      expect(items.filter((n) => !n.visible).map((n) => n.id_menu).sort()).toEqual([parent, COLOR].sort());
      expect((await svc.menu('2')).filter((n) => !n.visible)).toHaveLength(2);
      expect((await svc.menu('1')).find((n) => n.id_menu === COLOR)?.visible).toBe(true);
    });

    it('S-PRM-9 rejects an unknown node with a 422 detail and stores nothing, an unknown perfil with 404, no tenant with 400', async () => {
      const svc = service();
      const hidden = async () => (await svc.menu('1')).filter((n) => !n.visible).length;
      const before = await hidden();
      const bad = await svc.saveMenu('1', [{ id: COLOR, visible: false }, { id: 9999, visible: false }]).catch((e: unknown) => e);
      expect(bad).toMatchObject({ status: 422, details: [{ field: 'items[1].id' }] });
      expect(await hidden()).toBe(before);
      expect(await svc.saveMenu('zzz', []).catch((e: unknown) => e)).toMatchObject({ status: 404 });
      expect(await service('').menu('1').catch((e: unknown) => e)).toMatchObject({ status: 400 });
    });

    it('reads the 13 flags of every form and of one form, overlaid with the perfil overrides (S-PRM-8)', async () => {
      const svc = service();
      const forms = await svc.permisos('1');

      expect(forms.map((f) => f.formId)).toEqual(Object.keys(permissionsSeed));
      expect(Object.keys(forms[0])).toEqual(['formId', ...PERMISSION_FLAGS]);
      expect(forms.find((f) => f.formId === 'miColor')).toMatchObject({ eliminate: false, add: true });
      expect(await svc.permiso('1', 'miAduana')).toEqual(permissionsSeed.miAduana);
      expect(await svc.permiso('2', 'miColor')).toMatchObject({ eliminate: true });
    });

    it('S-PRM-6 / S-PRM-7 stores the changed cells only, per form or for every form, and answers what is stored', async () => {
      const svc = service();
      const one = await svc.savePermiso('2', 'miAduana', [{ formId: 'miAduana', flag: 'eliminate', value: false }]);

      expect(one).toEqual({ ...permissionsSeed.miAduana, eliminate: false });
      const all = await svc.savePermisos('2', [{ formId: 'miColor', flag: 'add', value: false }]);
      expect(all.find((f) => f.formId === 'miColor')?.add).toBe(false);
      expect(all.find((f) => f.formId === 'miAduana')?.eliminate).toBe(false);
      expect((await svc.permiso('1', 'miAduana')).eliminate).toBe(true);
    });

    it('S-PRM-9 rejects an unknown flag with a 422 detail, an unknown form on the path with 422, an unknown perfil with 404', async () => {
      const svc = service();
      expect(await svc.savePermisos('2', [{ formId: 'miColor', flag: 'nope' as never, value: true }]).catch((e: unknown) => e)).toMatchObject({
        status: 422,
        details: [{ field: 'items[0].flag' }],
      });
      expect(await svc.savePermiso('2', 'zzz', []).catch((e: unknown) => e)).toMatchObject({ status: 422 });
      expect(await svc.permiso('zzz', 'miColor').catch((e: unknown) => e)).toMatchObject({ status: 404 });
    });
  });
}
