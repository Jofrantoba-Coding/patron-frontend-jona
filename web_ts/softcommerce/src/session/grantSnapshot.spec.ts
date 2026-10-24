import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { useTestServer } from '../../mock-server/http/test-server';
import menuSeed from '../../mock-server/data/menu.json';
import { DENY_ALL, type Permissions } from '../domain/permissions';
import { createGrantsServiceHttp } from '../services/GrantsServiceHttp';
import type { MenuItem } from '../domain/menuTree';
import type { GrantsSnapshot } from '../services/InterGrantsService';
import type { InterShellService } from '../services/InterShellService';
import { createShellServiceHttp } from '../services/ShellServiceHttp';
import { createHttpClient } from '../services/httpClient';
import { withGrantsSnapshot } from '../services/withGrantsSnapshot';
import { createSessionStore } from './sessionStore';

const ALL_ON = Object.fromEntries(Object.keys(DENY_ALL).map((flag) => [flag, true])) as Permissions;
const snapshot: GrantsSnapshot = { menu: [menuSeed[0] as MenuItem], permissions: { miColor: { ...ALL_ON, eliminate: false } } };

function liveShell() {
  return {
    menu: vi.fn().mockResolvedValue(menuSeed),
    permissions: vi.fn().mockResolvedValue(ALL_ON),
  } satisfies InterShellService;
}

describe('withGrantsSnapshot (R-AUTH-11)', () => {
  it('answers the menu and every form from the snapshot without touching the server', async () => {
    const live = liveShell();
    const shell = withGrantsSnapshot(live, () => snapshot);

    expect(await shell.menu()).toEqual([menuSeed[0]]);
    expect((await shell.permissions('miColor')).eliminate).toBe(false);
    expect(live.menu).not.toHaveBeenCalled();
    expect(live.permissions).not.toHaveBeenCalled();
  });

  it('S-AUTH-31 denies a form the snapshot does not hold (fail closed)', async () => {
    expect(await withGrantsSnapshot(liveShell(), () => snapshot).permissions('noForm')).toEqual(DENY_ALL);
  });

  it('delegates when there is no snapshot: before login and for a session stored without grants', async () => {
    const live = liveShell();
    const shell = withGrantsSnapshot(live, () => undefined);

    expect(await shell.menu()).toEqual(menuSeed);
    expect(await shell.permissions('miColor')).toEqual(ALL_ON);
  });
});

describe('S-AUTH-26 / S-PRM-16 / S-AUTH-31: edits apply at the next login', () => {
  const server = useTestServer({ dataDir: fileURLToPath(new URL('../../mock-server/data', import.meta.url)) });
  const memory = new Map<string, string>();
  const storage = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => void memory.set(k, v), removeItem: (k: string) => void memory.delete(k) } as Storage;
  const call = (method: string, path: string, body?: unknown) => server.call(method, path, { tenant: 'demo', body });
  const ADUANA = menuSeed.find((m) => m.nombre === 'miAduana')!.id_menu;

  /** One "login": the snapshot taken with the user header, kept in a session store like step 2 does. */
  async function login(userId: string) {
    const store = createSessionStore(storage);
    const client = createHttpClient({ baseUrl: server.url(), getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId }) });
    const grants = await createGrantsServiceHttp(client).snapshot();
    store.setSession({
      tenantId: 'demo', token: 't', user: { id_usuario: Number(userId), usuario: 'perfilado', nombre: 'P' }, empresa: { id: '1', name: 'E' },
      puntoVenta: { id: '1', name: 'P', id_empresa: '1' }, periodo: { fechaInicio: '2026-01-01', fechaFin: '2026-12-31' },
      params: { INICIO_ACTIVIDADES: '2020-01-01', IS_FACTURADOR_SUNAT: false, ISBOTICA: false, DESPACHO_AUTOMATICO: false }, grants,
    });
    return { store, shell: withGrantsSnapshot(createShellServiceHttp(client), () => store.getSnapshot().session?.grants) };
  }

  it('an open session keeps Aduana and Delete on Color; a new login omits Aduana and disables Delete', async () => {
    memory.clear();
    const created = await call('POST', '/v1/usuarios', { id_trabajador: '001', usuario: 'perfilado', clave: 'secreto1', clave_confirmacion: 'secreto1' });
    const userId = String(created.body.id_usuario);
    const open = await login(userId);
    expect((await open.shell.menu()).map((m) => m.nombre)).toContain('miAduana');

    await call('PUT', '/v1/tipos-trabajador-perfil/1/menu', [{ id: ADUANA, visible: false }]);
    await call('PUT', '/v1/tipos-trabajador-perfil/1/permisos/miColor', [{ flag: 'eliminate', value: false }]);

    // The open session, even for a form it never opened (S-AUTH-31), still has the snapshot.
    expect((await open.shell.menu()).map((m) => m.nombre)).toContain('miAduana');
    expect((await open.shell.permissions('miColor')).eliminate).toBe(true);
    // The session survives a reload: the snapshot is stored with it.
    expect(createSessionStore(storage).getSnapshot().session?.grants).toEqual(open.store.getSnapshot().session?.grants);

    const next = await login(userId);
    expect((await next.shell.menu()).map((m) => m.nombre)).not.toContain('miAduana');
    expect((await next.shell.permissions('miColor')).eliminate).toBe(false);
  });
});
