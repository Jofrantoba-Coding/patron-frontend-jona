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
 * R-MST-12 Credito and Credito Temp of the Cliente (`FormClienteCredito`, `ClienteCreditoTableModel`) and their totals (D27a), on both mock sources. Seeded: cliente 1 holds one credito of
 * 5000 and one credito temporal of 1200 (2025-11-01 to 2025-12-31); the tenant `demo` has IS_CLIENTE_CREDITO true. The two tabs are two children (`creditos`, `creditos_temp`): the desktop kept
 * one list with a TEMPORAL flag, the web keeps one section per tab.
 */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const server = useTestServer({ seed: loadSeed(dataDir) });
const kid = (name: string) => REGISTRY.childEntries.find((c: any) => c.parent === 'clientes' && c.childName === name);

describe('R-MST-12 the credit child entries', () => {
  it('are two dialog tabs behind IS_CLIENTE_CREDITO whose rows are additive (no Quitar, no deactivate action)', () => {
    for (const [name, tab] of [['creditos', 'Credito'], ['creditos_temp', 'Credito Temp']]) {
      expect(kid(name)).toMatchObject({ tab, removal: 'none', entry: 'dialog', gate: { param: 'IS_CLIENTE_CREDITO' } });
      expect(kid(name).actions).toBeUndefined();
    }
  });

  it('the dialog asks Motivo, Monto and F Inicio, and F Fin only for the temporal credit, which cannot end before it starts', () => {
    expect(kid('creditos').fields.map((f: any) => f.label)).toEqual(['Codigo', 'Motivo', 'Monto', 'F Inicio']);
    expect(kid('creditos_temp').fields.map((f: any) => f.label)).toEqual(['Codigo', 'Motivo', 'Monto', 'F Inicio', 'F Fin']);
    expect(kid('creditos_temp').fields.find((f: any) => f.name === 'f_fin')).toMatchObject({ afterField: 'f_inicio', messages: { afterField: 'Fecha es menor a fecha inicial' } });
  });

  it('the parent declares the two sums and shows them read-only behind the same parameter', () => {
    const clientes = REGISTRY.bySlug.get('clientes');
    expect(clientes.aggregate).toEqual(expect.arrayContaining([
      { as: 'credito', child: 'creditos', op: 'sum', field: 'monto' }, { as: 'credito_temp', child: 'creditos_temp', op: 'sum', field: 'monto' },
    ]));
    for (const name of ['credito', 'credito_temp']) expect(clientes.fields.find((f: any) => f.name === name)).toMatchObject({ kind: 'number', gate: { param: 'IS_CLIENTE_CREDITO' }, readOnlyOn: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] });
  });
});

describe.each([
  ['in-browser mock', () => { const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed: seed }); return { catalog: mock.catalog('clientes'), children: mock.children('clientes') }; }],
  ['http mock server', () => { const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER }); return { catalog: createCatalogServiceHttp(client, 'clientes'), children: createChildServiceHttp(client, 'clientes') }; }],
])('Cliente creditos: %s', (_label, make) => {
  const update = (catalog: any, children: Record<string, unknown[]>, id = '0000000001') => catalog.update(id, { children });
  const totals = async (catalog: any, id = '0000000001') => { const row = await catalog.get(id); return [row.credito, row.credito_temp]; };

  it('S-MST-25 the totals are the sums of the montos of each kind, 0 where there are none', async () => {
    const { catalog } = make();
    expect(await totals(catalog)).toEqual([5000, 1200]);
    expect(await totals(catalog, '0000000002')).toEqual([0, 0]);
  });

  it('S-MST-25 a credit AMPLIACION of 1500 makes Credito the previous sum plus 1500 and leaves the temporal one alone', async () => {
    const { catalog, children } = make();
    await update(catalog, { creditos: [{ op: 'I', motivo: 'ampliacion', monto: 1500, f_inicio: '2026-03-01' }] });
    expect(await totals(catalog)).toEqual([6500, 1200]);
    expect((await children.list('0000000001', 'creditos')).items.map((r) => [r.motivo, r.monto, r.f_inicio, r.estado])).toEqual([['LINEA INICIAL', 5000, '2025-01-02', 'A'], ['AMPLIACION', 1500, '2026-03-01', 'A']]);
  });

  it('S-MST-25 a blank motivo says Ingrese Motivo, then a blank monto says Ingrese Monto', async () => {
    const { catalog } = make();
    await expect(update(catalog, { creditos: [{ op: 'I', motivo: '', monto: '' }] })).rejects.toMatchObject({ status: 422, details: [{ field: 'creditos[0].motivo', message: 'Ingrese Motivo' }] });
    await expect(update(catalog, { creditos: [{ op: 'I', motivo: 'x', monto: '' }] })).rejects.toMatchObject({ status: 422, details: [{ field: 'creditos[0].monto', message: 'Ingrese Monto' }] });
  });

  it('S-MST-25 a temporal credit whose fin is before its inicio says Fecha es menor a fecha inicial on the fin', async () => {
    const { catalog } = make();
    const temp = (over: Record<string, unknown>) => ({ op: 'I', motivo: 'campana', monto: 300, f_inicio: '2026-03-10', f_fin: '2026-03-20', ...over });
    await expect(update(catalog, { creditos_temp: [temp({ f_fin: '2026-03-09' })] })).rejects.toMatchObject({ status: 422, details: [{ field: 'creditos_temp[0].f_fin', message: 'Fecha es menor a fecha inicial' }] });
    expect(await totals(catalog)).toEqual([5000, 1200]);
  });

  it('S-MST-25 [DEVIATION] the fin of a temporal credit is stored as entered, not copied from the inicio; the same day is accepted', async () => {
    const { catalog, children } = make();
    await update(catalog, { creditos_temp: [{ op: 'I', motivo: 'campana', monto: 300, f_inicio: '2026-03-10', f_fin: '2026-03-20' }, { op: 'I', motivo: 'dia', monto: 50, f_inicio: '2026-04-01', f_fin: '2026-04-01' }] });
    expect((await children.list('0000000001', 'creditos_temp')).items.slice(1).map((r) => [r.f_inicio, r.f_fin])).toEqual([['2026-03-10', '2026-03-20'], ['2026-04-01', '2026-04-01']]);
    expect(await totals(catalog)).toEqual([5000, 1550]);
  });

  it('the dates default to today when the body gives none, a plain credit has no fin, and a body never writes the totals', async () => {
    const { catalog, children } = make();
    await catalog.update('0000000002', { credito: 99, credito_temp: 98, children: { creditos: [{ op: 'I', motivo: 'm', monto: 10, f_fin: '2030-01-01' }], creditos_temp: [{ op: 'I', motivo: 't', monto: 5 }] } });
    const [credito] = (await children.list('0000000002', 'creditos')).items;
    const [temp] = (await children.list('0000000002', 'creditos_temp')).items;
    expect(credito.f_inicio).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(credito.f_fin).toBeUndefined();
    expect(temp.f_fin).toBe(temp.f_inicio);
    expect(await totals(catalog, '0000000002')).toEqual([10, 5]);
  });
});
