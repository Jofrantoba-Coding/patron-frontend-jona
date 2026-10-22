import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTestServer } from '../mock-server/http/test-server';
import type { Localidad } from '../src/catalogs/localidad/localidad.config';
import { composeServices } from '../src/services/serviceComposer';

const server = useTestServer();
afterEach(() => vi.restoreAllMocks());

/** S-LOC-18 / S-LOC-19: the composed services behave the same in mock mode (no network) and over HTTP. */
describe.each(['mock', 'http'] as const)('Localidad dual-source parity: %s', (mode) => {
  const compose = () =>
    composeServices(
      mode === 'http' ? { VITE_API_MODE: 'http', VITE_API_URL: server.url() } : { VITE_API_MODE: 'mock' },
      { getSession: () => ({ tenantId: 'demo' }) },
    );

  it('S-LOC-2 / S-LOC-7 / S-LOC-13: create, cascade reload and logical delete', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { catalog, lookup } = compose();
    const localidades = catalog<Localidad>('localidades');

    const created = await localidades.create({ id_empresa: '1', descripcion: 'SEDE LIMA', direccion: 'AV. X 1', id_ubigeo: '150103' });
    expect(created).toMatchObject({ descripcion: 'SEDE LIMA', empresa: 'COMERCIAL DEMO SAC', distrito: 'ATE' });
    expect((await localidades.list()).items.map((r) => r.id_localidad)).toContain(created.id_localidad);

    expect((await lookup.ubigeoChildren('15')).map((u) => u.id)).toEqual(['1501', '1505']);
    expect((await lookup.ubigeoChildren('08')).map((u) => u.id)).toEqual(['0801']);

    await localidades.remove('2');
    expect((await localidades.list()).items.map((r) => r.id_localidad)).not.toContain('2');
    await expect(localidades.get('2')).resolves.toMatchObject({ id_localidad: '2' });
    expect(fetchSpy.mock.calls.length > 0).toBe(mode === 'http');
  });
});
