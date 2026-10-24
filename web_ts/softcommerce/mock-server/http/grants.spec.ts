import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menuSeed from '../data/menu.json';
import permissionsSeed from '../data/permissions.json';
import { useTestServer } from './test-server';

const server = useTestServer({ dataDir: fileURLToPath(new URL('../data', import.meta.url)) });
const call = (method: string, path: string, body?: unknown, tenant = 'demo', headers: Record<string, string> = {}) =>
  server.call(method, path, { tenant, body, headers });
const ADUANA = menuSeed.find((m) => m.nombre === 'miAduana')!.id_menu;
const PERFIL = '/v1/tipos-trabajador-perfil/1';

/** A user of perfil 1 through trabajador 001: created through the Usuario master so the login path is the real one. */
const perfilUser = async () => {
  const res = await call('POST', '/v1/usuarios', { id_trabajador: '001', usuario: 'perfilado', clave: 'secreto1', clave_confirmacion: 'secreto1' }, 'demo');
  expect(res.status).toBe(201);
  return String(res.body.id_usuario);
};

describe('S-PRM-8 defaults and the routes', () => {
  it('answers the permissions.json flags of a form, every form and the menu with its visibility', async () => {
    expect((await call('GET', `${PERFIL}/permisos/miAduana`)).body).toMatchObject({ add: true, eliminate: true });
    expect((await call('GET', `${PERFIL}/permisos`)).body.items).toHaveLength(Object.keys(permissionsSeed).length);
    const menu = (await call('GET', `${PERFIL}/menu`)).body.items;
    expect(menu).toHaveLength(menuSeed.length);
    expect(menu.every((n: any) => n.visible === true)).toBe(true);
  });
});

describe('S-PRM-9 contract errors', () => {
  it('404 for an unknown perfil, 422 with a detail for an unknown node, form or flag, 400 without a tenant', async () => {
    expect((await call('PUT', '/v1/tipos-trabajador-perfil/zzz/menu', [])).status).toBe(404);
    const node = await call('PUT', `${PERFIL}/menu`, [{ id: 9999, visible: false }]);
    expect([node.status, node.body.code, node.body.details.length]).toEqual([422, 'VALIDATION_ERROR', 1]);
    expect((await call('PUT', `${PERFIL}/permisos`, [{ formId: 'noForm', flag: 'add', value: true }])).status).toBe(422);
    expect((await call('PUT', `${PERFIL}/permisos/miColor`, [{ flag: 'fly', value: true }])).status).toBe(422);
    expect((await call('PUT', `${PERFIL}/permisos/noForm`, [{ flag: 'add', value: true }])).status).toBe(422);
    for (const [method, path] of [['GET', `${PERFIL}/menu`], ['PUT', `${PERFIL}/permisos`], ['GET', `${PERFIL}/permisos/miColor`]]) {
      const res = await call(method, path, method === 'PUT' ? [] : undefined, '');
      expect([res.status, res.body.code]).toEqual([400, 'TENANT_REQUIRED']);
    }
  });
});

describe('S-AUTH-30 and S-MOCK-58 resolution by X-User-Id', () => {
  it('without the header (and for a seeded user) the seeded defaults, W1 unchanged', async () => {
    await call('PUT', `${PERFIL}/permisos/miColor`, [{ flag: 'eliminate', value: false }]);
    await call('PUT', `${PERFIL}/menu`, [{ id: ADUANA, visible: false }]);

    expect((await call('GET', '/forms/miColor/permissions')).body.eliminate).toBe(true);
    expect((await call('GET', '/forms/miColor/permissions', undefined, 'demo', { 'X-User-Id': '1' })).body.eliminate).toBe(true);
    expect((await call('GET', '/menu')).body.items).toEqual(menuSeed);
    expect(Object.keys((await call('GET', '/forms/permissions')).body)).toEqual(Object.keys(permissionsSeed));
  });

  it('with the header of a user of the perfil, its flags, its menu and the batch', async () => {
    const id = await perfilUser();
    await call('PUT', `${PERFIL}/permisos/miAduana`, [{ flag: 'add', value: false }]);
    await call('PUT', `${PERFIL}/permisos/miColor`, [{ flag: 'eliminate', value: false }]);
    await call('PUT', `${PERFIL}/menu`, [{ id: ADUANA, visible: false }]);
    const as = { 'X-User-Id': id };

    expect((await call('GET', '/forms/miAduana/permissions', undefined, 'demo', as)).body.add).toBe(false);
    expect((await call('GET', '/menu', undefined, 'demo', as)).body.items.map((m: any) => m.nombre)).not.toContain('miAduana');
    const batch = (await call('GET', '/forms/permissions', undefined, 'demo', as)).body;
    expect(Object.keys(batch)).toEqual(Object.keys(permissionsSeed));
    expect([batch.miColor.eliminate, batch.miColor.add, batch.miAduana.add]).toEqual([false, true, false]);
  });

  it('the batch needs the tenant like the other routes', async () => {
    expect((await call('GET', '/forms/permissions', undefined, '')).status).toBe(400);
  });
});
