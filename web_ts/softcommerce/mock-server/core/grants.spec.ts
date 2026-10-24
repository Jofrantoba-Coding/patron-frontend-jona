import { beforeEach, describe, expect, it } from 'vitest';
import menuSeed from '../data/menu.json';
import permissionsSeed from '../data/permissions.json';
import { getMenu, getPermissions } from './auth.js';
import {
  allPermissions, getPerfilMenu, getPerfilPermiso, getPerfilPermisos, putPerfilMenu, putPerfilPermisos,
} from './grants.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { fileURLToPath } from 'node:url';
import { loadSeed } from '../http/loadSeed.js';

const store = createStore(loadSeed(fileURLToPath(new URL('../data', import.meta.url))));
const ADUANA = menuSeed.find((m) => m.nombre === 'miAduana')!.id_menu;
const ctxOf = (userId: string, tenantId = 'demo') => ({ userId, tenantId });

function catchError(fn: () => unknown): MockError {
  try {
    fn();
  } catch (e) {
    return e as MockError;
  }
  throw new Error('expected function to throw');
}

// User 10 reaches perfil "1" through trabajador 001 (R-AUTH-11); user 11 has no trabajador.
beforeEach(() => {
  store.reset();
  store.shared.users.push(
    { id_usuario: '10', usuario: 'perfilado', id_trabajador: '001', tenants: ['demo'], activo: true },
    { id_usuario: '11', usuario: 'sintrab', tenants: ['demo'], activo: true },
  );
});

describe('effective grants without overrides (S-AUTH-27, S-PRM-8)', () => {
  it('equal the seeded defaults with no user, no trabajador or no overrides', () => {
    for (const ctx of [undefined, {}, ctxOf('1'), ctxOf('11'), ctxOf('10'), ctxOf('999')]) {
      expect(getMenu(store, ctx).items).toEqual(menuSeed);
      expect(getPermissions(store, 'miAduana', ctx)).toEqual(getPermissions(store, 'miAduana'));
    }
    expect(getPerfilPermiso(store, 'demo', '1', 'miAduana')).toEqual(getPermissions(store, 'miAduana'));
  });

  it('answers the permissions.json flags for the perfil form route', () => {
    const flags = getPerfilPermiso(store, 'demo', '1', 'miAduana');

    expect(flags).toMatchObject({ add: true, eliminate: true });
    expect(Object.keys(flags)).toHaveLength(13);
  });

  it('lists every form with its 13 flags and every menu node as visible', () => {
    expect(getPerfilPermisos(store, 'demo', '1').items).toHaveLength(Object.keys(permissionsSeed).length);
    expect(getPerfilPermisos(store, 'demo', '1').items[0]).toHaveProperty('formId');
    expect(getPerfilMenu(store, 'demo', '1').items.every((n: any) => n.visible === true)).toBe(true);
  });
});

describe('overrides overlay the defaults of the perfil of the user', () => {
  it('hides an unchecked node and leaves its children (no propagation) for that perfil only', () => {
    putPerfilMenu(store, 'demo', '1', [{ id: ADUANA, visible: false }]);

    const names = (ctx: any) => getMenu(store, ctx).items.map((m: any) => m.nombre);
    expect(names(ctxOf('10'))).not.toContain('miAduana');
    expect(names(ctxOf('10'))).toContain('miColor');
    expect(names(ctxOf('1'))).toContain('miAduana');
    expect(names(undefined)).toContain('miAduana');
    expect(getPerfilMenu(store, 'demo', '2').items.find((n: any) => n.id_menu === ADUANA).visible).toBe(true);
  });

  it('applies a flag override to the user of the perfil and to no one else', () => {
    putPerfilPermisos(store, 'demo', '1', [{ formId: 'miColor', flag: 'eliminate', value: false }]);

    expect(getPermissions(store, 'miColor', ctxOf('10')).eliminate).toBe(false);
    expect(getPermissions(store, 'miColor', ctxOf('10')).add).toBe(true);
    expect(getPermissions(store, 'miColor', ctxOf('1')).eliminate).toBe(true);
    expect(getPermissions(store, 'miColor').eliminate).toBe(true);
    expect(getPerfilPermiso(store, 'demo', '1', 'miColor').eliminate).toBe(false);
  });

  it('upserts: the last value of a cell wins and the batch carries every form', () => {
    putPerfilPermisos(store, 'demo', '1', [{ formId: 'miColor', flag: 'eliminate', value: false }]);
    putPerfilPermisos(store, 'demo', '1', [{ formId: 'miColor', flag: 'eliminate', value: true }, { formId: 'miAduana', flag: 'add', value: false }]);

    const batch = allPermissions(store, ctxOf('10'));
    expect(Object.keys(batch)).toEqual(Object.keys(permissionsSeed));
    expect(batch.miColor.eliminate).toBe(true);
    expect(batch.miAduana.add).toBe(false);
    expect(allPermissions(store)).toEqual(Object.fromEntries(Object.keys(permissionsSeed).map((f) => [f, getPermissions(store, f)])));
  });

  it('the single-form PUT takes the form from the path', () => {
    putPerfilPermisos(store, 'demo', '1', [{ flag: 'add', value: false }], 'miColor');

    expect(getPermissions(store, 'miColor', ctxOf('10')).add).toBe(false);
  });
});

describe('contract errors (S-PRM-9)', () => {
  it('404 for an unknown perfil on every route', () => {
    for (const run of [
      () => getPerfilMenu(store, 'demo', 'zzz'),
      () => putPerfilMenu(store, 'demo', 'zzz', []),
      () => getPerfilPermisos(store, 'demo', 'zzz'),
      () => getPerfilPermiso(store, 'demo', 'zzz', 'miAduana'),
      () => putPerfilPermisos(store, 'demo', 'zzz', []),
      () => getPerfilMenu(store, 'demo', '3'),
    ]) {
      expect(catchError(run).status).toBe(404);
    }
  });

  it('422 with a detail for an unknown node, form or flag, and stores nothing', () => {
    const node = catchError(() => putPerfilMenu(store, 'demo', '1', [{ id: ADUANA, visible: false }, { id: 9999, visible: false }]));
    const form = catchError(() => putPerfilPermisos(store, 'demo', '1', [{ formId: 'noForm', flag: 'add', value: true }]));
    const flag = catchError(() => putPerfilPermisos(store, 'demo', '1', [{ formId: 'miColor', flag: 'fly', value: true }]));
    const value = catchError(() => putPerfilPermisos(store, 'demo', '1', [{ formId: 'miColor', flag: 'add', value: 'yes' }]));

    for (const error of [node, form, flag, value]) {
      expect(error.status).toBe(422);
      expect(error.details.length).toBeGreaterThan(0);
    }
    expect(node.details[0].field).toBe('items[1].id');
    expect(form.details[0].field).toBe('items[0].formId');
    expect(flag.details[0].field).toBe('items[0].flag');
    expect(getMenu(store, ctxOf('10')).items).toEqual(menuSeed);
  });
});
