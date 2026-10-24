import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { seed } from '../../src/services/mock/seed';

/**
 * R-ANX-7, R-ANX-8 on the Cliente (`RegisterClienteNuevo`, `FormAnexoPadron(..., 2, ...)`; S-ANX-9, S-ANX-10, S-ANX-11, S-MD-8), on both mock sources. Seeded: cliente 1 has the padron 02 active
 * (A Retencion on), cliente 2 none. The Cliente offers `01`, `02` and `03`.
 */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const server = useTestServer({ seed: loadSeed(dataDir) });
const RUC = { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac', id_clasif_cliente: '1' };
const add = (id_padron: string) => ({ op: 'I', id_padron, f_inicio: '2026-03-11' });
const INCOMPATIBLE_PERCEPCION = 'Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion';
const INCOMPATIBLE_EXCEPTUADO = 'Configuracion incompatible, Desactive Exceptuado';

describe('R-ANX-7 the padron pieces of the Cliente entry', () => {
  const clientes = REGISTRY.bySlug.get('clientes');
  const padrones = REGISTRY.childEntries.find((c: any) => c.parent === 'clientes' && c.childName === 'padrones');

  it('names the padron rule with the flag of each padron id, and shows the three flags in the desktop order (A Percepcion, A Retencion, Exceptuado)', () => {
    expect(clientes.rules.find((r: any) => r.name === 'padron').params).toEqual({ child: 'padrones', flags: { '01': 'flag_exceptuado', '02': 'flag_retencion', '03': 'flag_percepcion' } });
    expect(clientes.fields.filter((f: any) => f.name.startsWith('flag_') && f.kind === 'boolean').map((f: any) => [f.name, f.label])).toEqual([
      ['flag_percepcion', 'A Percepcion'], ['flag_retencion', 'A Retencion'], ['flag_exceptuado', 'Exceptuado'],
    ]);
  });

  it('the Padrones tab sits after the credit tabs and the offer is over the padrones the Cliente takes', () => {
    expect(REGISTRY.childEntries.filter((c: any) => c.parent === 'clientes').map((c: any) => c.tab)).toEqual([
      'Activación de Cliente', 'Direcciones', 'Sustitutos', 'Credito', 'Credito Temp', 'Padrones', 'Contactos', 'Cuentas',
    ]);
    expect(padrones.fields.find((f: any) => f.name === 'id_padron').source).toEqual({ catalog: 'padrones', where: { para_cliente: true } });
  });

  it('the list shows AP, AR and EX after DIRECCION, as the desktop table does', () => {
    const headers = clientes.columns.map((c: any) => c.header);
    expect(headers.slice(headers.indexOf('DIRECCION'), headers.indexOf('DIRECCION') + 4)).toEqual(['DIRECCION', 'AP', 'AR', 'EX']);
    expect(clientes.columns.filter((c: any) => ['AP', 'AR', 'EX'].includes(c.header)).map((c: any) => [c.key, c.type])).toEqual([['flag_percepcion', 'bool'], ['flag_retencion', 'bool'], ['flag_exceptuado', 'bool']]);
  });
});

describe.each([
  ['in-browser mock', () => { const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed: seed }); return { catalog: mock.catalog('clientes'), children: mock.children('clientes'), lookup: mock.lookup }; }],
  ['http mock server', () => { const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER }); return { catalog: createCatalogServiceHttp(client, 'clientes'), children: createChildServiceHttp(client, 'clientes'), lookup: createLookupServiceHttp(client) }; }],
])('Cliente padrones: %s', (_label, make) => {
  const flags = async (catalog: any, id: string) => { const r = await catalog.get(id); return [r.flag_percepcion, r.flag_retencion, r.flag_exceptuado]; };
  const create = (catalog: any, ...ops: Record<string, unknown>[]) => catalog.create({ ...RUC, children: { padrones: ops } });
  const refusal = (message: string, index = 0) => ({ status: 409, code: 'ACTION_NOT_ALLOWED', message, details: [{ field: `padrones[${index}].id_padron`, message }] });

  it('S-ANX-10 the padron select offers 01, 02 and 03 for the Cliente', async () => {
    const { lookup } = make();
    expect((await lookup.options('padrones', { para_cliente: 'true' })).map((o) => o.id)).toEqual(['01', '02', '03']);
  });

  it('R-ANX-8 the seeded flags follow the active rows', async () => {
    const { catalog } = make();
    expect(await flags(catalog, '0000000001')).toEqual([false, true, false]);
    expect(await flags(catalog, '0000000002')).toEqual([false, false, false]);
  });

  it('S-ANX-9 the same padron again says Padron ya se Encuentra Activado, naming the padron of that row', async () => {
    const { catalog } = make();
    await expect(catalog.update('0000000001', { children: { padrones: [add('02')] } })).rejects.toMatchObject(refusal('Padron ya se Encuentra Activado'));
  });

  it('S-ANX-9 01 over an active 02 (and over an active 03, the case the desktop missed) says the percepcion / retencion sentence', async () => {
    const { catalog } = make();
    await expect(catalog.update('0000000001', { children: { padrones: [add('01')] } })).rejects.toMatchObject(refusal(INCOMPATIBLE_PERCEPCION));
    await expect(create(catalog, add('03'), add('01'))).rejects.toMatchObject(refusal(INCOMPATIBLE_PERCEPCION, 1));
  });

  it('S-ANX-9 02 over an active 01 says Desactive Exceptuado', async () => {
    const { catalog } = make();
    await expect(create(catalog, add('01'), add('02'))).rejects.toMatchObject(refusal(INCOMPATIBLE_EXCEPTUADO, 1));
  });

  it('S-MD-8 a refused body stores nothing: the parent is not created', async () => {
    const { catalog } = make();
    const before = (await catalog.list({ pageSize: 50 })).items.length;
    await expect(create(catalog, add('01'), add('03'))).rejects.toMatchObject({ status: 409 });
    expect((await catalog.list({ pageSize: 50 })).items.length).toBe(before);
  });

  it('R-ANX-8 a create with padron 03 checks A Percepcion only; a body never writes the flags', async () => {
    const { catalog } = make();
    const created = (await catalog.create({ ...RUC, flag_retencion: true, children: { padrones: [add('03')] } })) as Record<string, unknown>;
    expect([created.flag_percepcion, created.flag_retencion, created.flag_exceptuado]).toEqual([true, false, false]);
  });

  it('S-ANX-11 deactivating the 02 row unchecks A Retencion and closes the row with a fin', async () => {
    const { catalog, children } = make();
    await catalog.update('0000000001', { children: { padrones: [{ op: 'A', id: '1', estado: 'D' }] } });
    expect(await flags(catalog, '0000000001')).toEqual([false, false, false]);
    expect((await children.list('0000000001', 'padrones')).items.map((r) => [r.padron, r.estado, r.f_fin !== ''])).toEqual([['AG. RETENCION', 'D', true]]);
  });
});
