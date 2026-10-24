import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { seed } from '../../src/services/mock/seed';

/**
 * R-MST-12 Sustitutos of the Cliente (`ClienteSustituto`, `FormClienteBuscar`) and the `CANT_SUST` aggregate (D27a), on both mock sources. Seeded: cliente 1 holds the sustituto
 * 2 (active) and the sustituto 3 (deactivated; the cliente 3 is itself deactivated). The tenant `demo` has IS_CLIENTE_SUSTITUTO true.
 */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const server = useTestServer({ seed: loadSeed(dataDir) });
const kid = REGISTRY.childEntries.find((c: any) => c.parent === 'clientes' && c.childName === 'sustitutos');
const DUPLICATE = 'Cliente ya Esta Agregado';

describe('R-MST-12 the sustitutos child entry', () => {
  it('is a picker child behind IS_CLIENTE_SUSTITUTO that is deactivated, never deleted, and may be reactivated', () => {
    expect(kid).toMatchObject({ tab: 'Sustitutos', removal: 'none', entry: 'picker', reactivable: true, gate: { param: 'IS_CLIENTE_SUSTITUTO' } });
    expect(kid.pick).toMatchObject({ picker: 'formClienteBuscar', field: 'id_hijo', message: DUPLICATE });
    expect(kid.unique).toMatchObject([{ fields: ['id_hijo'], errorField: 'id_hijo', message: DUPLICATE }]);
  });

  it('the grid shows the cliente beside the state: RUC/DNI, RAZON SOCIAL, DIRECCION, AP, AR, EX; Activar and Desactivar are the row actions', () => {
    expect(kid.columns.map((c: any) => c.header)).toEqual(['RUC/DNI', 'RAZON SOCIAL', 'DIRECCION', 'AP', 'AR', 'EX']);
    expect(kid.actions.map((a: any) => [a.id, a.label, a.kind, a.rule, a.confirm])).toEqual([
      ['activar', 'Activar', 'deferred', 'activarSustituto', 'Desea activar Cliente Sustituto?'],
      ['desactivar', 'Desactivar', 'deferred', 'desactivarSustituto', 'Desea Desactivar Cliente Sustituto?'],
    ]);
  });

  it('the list shows CANT_SUST only with the parameter on', () => {
    expect(REGISTRY.bySlug.get('clientes').columns.find((c: any) => c.key === 'cant_sust')).toMatchObject({ header: 'CANT_SUST', gate: { param: 'IS_CLIENTE_SUSTITUTO' } });
    expect(REGISTRY.bySlug.get('clientes').aggregate).toEqual([{ as: 'cant_sust', child: 'sustitutos', op: 'count', where: { estado: 'A' } }]);
  });
});

describe.each([
  ['in-browser mock', () => { const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed: seed }); return { catalog: mock.catalog('clientes'), children: mock.children('clientes') }; }],
  ['http mock server', () => { const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER }); return { catalog: createCatalogServiceHttp(client, 'clientes'), children: createChildServiceHttp(client, 'clientes') }; }],
])('Cliente sustitutos: %s', (_label, make) => {
  const update = (catalog: any, ops: unknown[]) => catalog.update('0000000001', { children: { sustitutos: ops } });
  const cant = async (catalog: any, id = '0000000001') => (await catalog.get(id)).cant_sust;

  it('S-MST-24 the nested list shows the sustituto with the data of its cliente and the state of that cliente', async () => {
    const { children } = make();
    expect((await children.list('0000000001', 'sustitutos')).items.map((r) => [r.id_hijo, r.estado, r.descripcion, r.numero_doc, r.estado_cliente])).toEqual([
      ['0000000002', 'A', 'RAMOS DIAZ ELENA', '45678912', 'true'], ['0000000003', 'D', 'KIM TRADING', '001234999', 'false'],
    ]);
  });

  it('D27a CANT_SUST is the count of the active sustitutos on the list and on the get, 0 where there are none', async () => {
    const { catalog } = make();
    expect(await cant(catalog)).toBe(1);
    expect((await catalog.list({ pageSize: 10 })).items.map((r: any) => [r.id_cliente, r.cant_sust])).toEqual([['0000000001', 1], ['0000000002', 0], ['0000000003', 0]]);
  });

  it('S-MST-24 the same cliente twice answers 409 on the indexed field with Cliente ya Esta Agregado', async () => {
    const { catalog } = make();
    await expect(update(catalog, [{ op: 'I', id_hijo: '0000000002' }])).rejects.toMatchObject({ status: 409, details: [{ field: 'sustitutos[0].id_hijo', message: DUPLICATE }] });
    await expect(update(catalog, [{ op: 'I', id_hijo: '0000000003' }, { op: 'I', id_hijo: '0000000003' }])).rejects.toMatchObject({ status: 409, details: [{ field: 'sustitutos[1].id_hijo' }] });
  });

  it('S-MST-24 a new sustituto raises the count; a deactivated one leaves it; Activar brings it back', async () => {
    const { catalog } = make();
    await catalog.get('0000000001');
    await update(catalog, [{ op: 'I', id_hijo: '0000000003' }]);
    expect(await cant(catalog)).toBe(2);
    await update(catalog, [{ op: 'A', id: '1', estado: 'D' }]);
    expect(await cant(catalog)).toBe(1);
    await update(catalog, [{ op: 'A', id: '1', estado: 'A' }]);
    expect(await cant(catalog)).toBe(2);
  });

  it('S-LKP-9 a reactivation that would repeat an active cliente is refused with the same message', async () => {
    const { catalog } = make();
    await update(catalog, [{ op: 'I', id_hijo: '0000000003' }]);
    await expect(update(catalog, [{ op: 'A', id: '2', estado: 'A' }])).rejects.toMatchObject({ status: 409, details: [{ field: 'sustitutos[0].id_hijo', message: DUPLICATE }] });
  });

  it('a body never writes CANT_SUST and a sustituto needs a cliente that exists', async () => {
    const { catalog } = make();
    await catalog.update('0000000002', { cant_sust: 99 });
    expect(await cant(catalog, '0000000002')).toBe(0);
    await expect(update(catalog, [{ op: 'I', id_hijo: '0000000099' }])).rejects.toMatchObject({ status: 422, details: [{ field: 'sustitutos[0].id_hijo' }] });
    await expect(update(catalog, [{ op: 'I', id_hijo: '' }])).rejects.toMatchObject({ status: 422, details: [{ field: 'sustitutos[0].id_hijo', message: 'Seleccione Cliente' }] });
  });
});
