import { describe, expect, it } from 'vitest';
import menuSeed from '../data/menu.json';
import {
  getMenu,
  getParams,
  getPermissions,
  listEmpresas,
  listPuntosVenta,
  login,
  sessionOptions,
  PERMISSION_FLAGS,
} from './auth.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { readSeed } from './test-helpers.js';

const store = createStore(readSeed());

function catchError(fn: () => unknown): MockError {
  try {
    fn();
  } catch (e) {
    return e as MockError;
  }
  throw new Error('expected function to throw');
}

describe('sessionOptions', () => {
  it('lists the tenants as { id, name }', () => {
    expect(sessionOptions(store).items).toEqual([
      { id: 'demo', name: 'Comercial Demo SAC' },
      { id: 'botica', name: 'Botica Salud EIRL' },
    ]);
  });
});

describe('login', () => {
  it('returns a token and the user without secrets on valid credentials', () => {
    const res = login(store, 'demo', { usuario: 'admin', clave: 'admin123' });
    expect(res.token).toBe('mock-token-1-demo');
    expect(res.user).toEqual({ id_usuario: 1, usuario: 'admin', nombre: 'Administrador' });
  });

  it('401 INVALID_CREDENTIALS for a wrong password, unknown user and blank input', () => {
    for (const body of [
      { usuario: 'admin', clave: 'wrong' },
      { usuario: 'ghost', clave: 'x' },
      { usuario: '', clave: '' },
      {},
    ]) {
      const err = catchError(() => login(store, 'demo', body as any));
      expect([err.status, err.code]).toEqual([401, 'INVALID_CREDENTIALS']);
    }
  });

  it('401 when the user does not belong to the tenant', () => {
    const err = catchError(() => login(store, 'botica', { usuario: 'cajero', clave: 'cajero123' }));
    expect([err.status, err.code]).toEqual([401, 'INVALID_CREDENTIALS']);
    expect(login(store, 'botica', { usuario: 'admin', clave: 'admin123' }).token).toBe('mock-token-1-botica');
  });

  it('403 USER_DISABLED when flaghabilitado is D', () => {
    const err = catchError(() => login(store, 'demo', { usuario: 'bloqueado', clave: 'bloq123' }));
    expect([err.status, err.code]).toEqual([403, 'USER_DISABLED']);
  });

  it('403 NO_DESKTOP_ACCESS when flagEscritorio is N', () => {
    const err = catchError(() => login(store, 'demo', { usuario: 'soloweb', clave: 'web123' }));
    expect([err.status, err.code]).toEqual([403, 'NO_DESKTOP_ACCESS']);
  });

  it('does not reveal a rejection reason for bad credentials of a disabled user', () => {
    const err = catchError(() => login(store, 'demo', { usuario: 'bloqueado', clave: 'wrong' }));
    expect(err.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('menu', () => {
  it('returns the flat MenuDinamico list from the seed', () => {
    const { items } = getMenu(store);
    expect(items).toHaveLength(menuSeed.length);
    expect(items[2]).toEqual({
      id_menu: 3,
      id_menu_padre: 2,
      menu_item: 'S',
      descripcion: 'Localidad',
      nombre: 'mi_localidad',
    });
  });

  it('serves a different menu seed without code changes (S-MOCK-13 at core level)', () => {
    const seed = readSeed();
    seed.menu = [{ id_menu: 99, id_menu_padre: null, menu_item: 'S', descripcion: 'Solo', nombre: 'solo' }];
    expect(getMenu(createStore(seed)).items.map((m: any) => m.id_menu)).toEqual([99]);
  });
});

describe('permissions', () => {
  it('returns the 13 seeded flags for a known form', () => {
    const perms = getPermissions(store, 'mi_localidad');
    expect(Object.keys(perms)).toEqual([...PERMISSION_FLAGS]);
    expect(PERMISSION_FLAGS).toHaveLength(13);
    expect(perms).toMatchObject({ add: true, eliminate: true, nullify: false, export: false });
    expect(getPermissions(store, 'miTipoCambio')).toMatchObject({ add: false, report: true, export: true });
  });

  it('returns all 13 flags false for an unknown form', () => {
    const perms = getPermissions(store, 'does_not_exist');
    expect(Object.keys(perms)).toHaveLength(13);
    expect(Object.values(perms).every((v) => v === false)).toBe(true);
  });

  it('treats a missing flag in a partial seed entry as false', () => {
    const seed = readSeed();
    seed.permissions = { partial: { add: true } };
    const perms = getPermissions(createStore(seed), 'partial');
    expect(perms.add).toBe(true);
    expect(perms.modify).toBe(false);
  });
});

describe('lookups', () => {
  it('lists empresas per tenant', () => {
    expect(listEmpresas(store, 'demo').items.map((e: any) => e.id)).toEqual(['1', '2']);
    expect(listEmpresas(store, 'botica').items).toHaveLength(1);
  });

  it('filters puntos de venta by id_empresa', () => {
    expect(listPuntosVenta(store, 'demo', { id_empresa: '1' }).items.map((p: any) => p.name)).toEqual([
      'TIENDA CENTRAL',
      'TIENDA MIRAFLORES',
    ]);
    expect(listPuntosVenta(store, 'demo', { id_empresa: '2' }).items.map((p: any) => p.name)).toEqual([
      'ALMACEN SUR',
    ]);
  });

  it('returns every punto de venta without a filter and none for an unknown empresa', () => {
    expect(listPuntosVenta(store, 'demo').items).toHaveLength(3);
    expect(listPuntosVenta(store, 'demo', { id_empresa: '77' }).items).toEqual([]);
  });

  it('returns the tenant params as flags', () => {
    expect(getParams(store, 'botica')).toMatchObject({ ISBOTICA: true, INICIO_ACTIVIDADES: '2022-03-01' });
    expect(getParams(store, 'demo')).toMatchObject({ ISBOTICA: false, IS_FACTURADOR_SUNAT: true });
  });
});
