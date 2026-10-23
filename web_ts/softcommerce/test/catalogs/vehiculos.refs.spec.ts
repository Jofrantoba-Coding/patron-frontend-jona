import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';

const session = () => ({ tenantId: 'demo' });
const server = useTestServer({ seed: loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url))) });
const ctx = { userId: '7', empresaId: '1' };

// S-MOCK-33: the logical delete of a catalog that a vehiculo refers to. A case runs on one catalog, so the cross-catalog steps live here, on both sources.
describe.each([
  ['in-browser mock', () => createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 })],
  ['http mock server', () => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: (slug: string) => createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  }],
])('S-MOCK-33 deleting a marca that a vehiculo uses (%s)', (_label, make) => {
  const body = { placa: 'nuevo1', constancia_inscripcion: 'ci-1', peso: 10, id_marca: '001', id_modelo: '001' };
  const deleteToyota = async (services: ReturnType<typeof make>) => services.catalog('marcas-vehiculo').remove('001');

  it('the marca leaves the default list and the options, but GET still resolves it flagged inactive', async () => {
    const services = make();
    expect((await services.catalog('vehiculos').get('001') as any).marca).toBe('TOYOTA');
    await deleteToyota(services);
    expect((await services.catalog('marcas-vehiculo').list({}) as any).items.map((r: any) => r.descripcion)).toEqual(['HYUNDAI', 'VOLVO']);
    expect((await services.lookup.options('marcas-vehiculo', { estado: 'true' })).map((o) => o.name)).toEqual(['HYUNDAI']);
    expect(await services.catalog('marcas-vehiculo').get('001')).toMatchObject({ descripcion: 'TOYOTA', activo: false });
  });

  it('a new write that references the deleted marca answers 422 on id_marca', async () => {
    const services = make();
    await deleteToyota(services);
    await expect(services.catalog('vehiculos').create(body)).rejects.toMatchObject({ status: 422, code: 'VALIDATION_ERROR', details: [{ field: 'id_marca' }] });
    await expect(services.catalog('vehiculos').update('002', { id_marca: '001' })).rejects.toMatchObject({ status: 422, details: [{ field: 'id_marca' }] });
  });

  it('the vehiculo that already used it stays listed and readable, with the marca name blank', async () => {
    const services = make();
    await deleteToyota(services);
    expect(await services.catalog('vehiculos').get('001')).toMatchObject({ placa: 'ABC123', id_marca: '001', marca: '' });
    expect((await services.catalog('vehiculos').list({}) as any).pagination.total).toBe(3);
  });

  it('a marca that is not deleted still takes a new vehiculo', async () => {
    const services = make();
    await deleteToyota(services);
    await expect(services.catalog('vehiculos').create({ ...body, id_marca: '002' })).resolves.toMatchObject({ id_marca: '002', marca: 'HYUNDAI' });
  });
});
