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
 * R-MST-15 the `Configuracion Almacen` tab of the Item (`RegisterItem.getPnlConfigItemAlmacen`, `FormItemAlmacen`, `desactivarAlmacen`; S-MST-30, S-MD-9, S-MOCK-43), on both mock sources.
 * Seeded: item 1 holds the almacen 001 for VENTA (active), the same almacen for DESPACHO (deactivated, closed) and a deleted row; item 2 holds none. The demo empresa 1 has the localidades 1 and 2
 * (points of sale 1 and 2, almacenes 001 and 002); the localidad 3 and the almacen 003 belong to the empresa 2.
 */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7', empresaId: '1' };
const server = useTestServer({ seed: loadSeed(dataDir) });
const kid = REGISTRY.childEntries.find((c: any) => c.parent === 'items' && c.childName === 'almacenes');
const DUPLICATE = 'Almacen ya se Encuentra Activado';
const ITEM = '000001';
const row = (over: Record<string, unknown> = {}) => ({ op: 'I', id_localidad: '2', id_punto_venta: '2', id_almacen: '002', proceso: 'VENTA', ...over });

describe('R-MST-15 the almacenes child entry', () => {
  it('is the tab Configuracion Almacen, deactivated never deleted, with the dialog messages of the desktop', () => {
    expect(kid).toMatchObject({ tab: 'Configuracion Almacen', removal: 'deactivate', entry: 'dialog', messages: { style: 'dialog' } });
    expect(kid.quitar).toEqual({ none: 'Seleccionar Fila', confirm: 'Desea Desactivar Almacen?', already: 'Almacen Seleccionado ya esta desactivado' });
  });

  it('the dialog is Localidad (session empresa), Pto Venta, Almacen, Proceso and Fecha Inicio, and the grid the desktop columns', () => {
    expect(kid.fields.filter((f: any) => f.kind !== 'code').map((f: any) => [f.name, f.label])).toEqual([['id_localidad', 'Localidad'], ['id_punto_venta', 'Pto Venta'], ['id_almacen', 'Almacen'], ['proceso', 'Proceso'], ['f_inicio', 'Fecha Inicio']]);
    expect(kid.fields.find((f: any) => f.name === 'id_localidad').source).toEqual({ catalog: 'localidades', where: { id_empresa: '$session.empresa' } });
    expect(kid.fields.find((f: any) => f.name === 'proceso').options.map((o: any) => o.value)).toEqual(['VENTA', 'DESPACHO']);
    expect(kid.columns.map((c: any) => c.header)).toEqual(['ALMACEN', 'F_INICIO', 'F_FIN', 'PROCESO']);
    expect(kid.unique).toMatchObject([{ fields: ['id_almacen', 'proceso'], errorField: 'id_almacen', message: DUPLICATE }]);
  });
});

describe('S-MST-32 the Item has no deferred child', () => {
  it('its only child is the almacenes (no unidades, precios, conversion, caracteristicas, descuento, cuenta, percepcion or promociones grid)', () => {
    expect(REGISTRY.childEntries.filter((c: any) => c.parent === 'items').map((c: any) => [c.childName, c.tab])).toEqual([['almacenes', 'Configuracion Almacen']]);
  });
});

describe.each([
  ['in-browser mock', () => { const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed }); return { catalog: mock.catalog('items'), children: mock.children('items') }; }],
  ['http mock server', () => { const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER }); return { catalog: createCatalogServiceHttp(client, 'items'), children: createChildServiceHttp(client, 'items') }; }],
])('Item almacenes: %s', (_label, make) => {
  const update = (catalog: any, ops: unknown[], id = ITEM) => catalog.update(id, { children: { almacenes: ops } });
  const refused = (field: string, message?: string, status = 422) => ({ status, details: [{ field: `almacenes[0].${field}`, ...(message ? { message } : {}) }] });

  it('S-MST-30 the grid lists the active and the deactivated row and not the deleted one', async () => {
    const { children } = make();
    expect((await children.list(ITEM, 'almacenes')).items.map((r) => [r.id, r.estado, r.almacen, r.proceso, r.f_fin])).toEqual([['1', 'A', 'ALMACEN CENTRAL', 'VENTA', ''], ['2', 'D', 'ALMACEN CENTRAL', 'DESPACHO', '2024-12-31']]);
  });

  it('S-MST-30 the messages come in the order Localidad, Punto de Venta, Almacen, Proceso', async () => {
    const { catalog } = make();
    await expect(update(catalog, [row({ id_localidad: '', id_punto_venta: '', id_almacen: '', proceso: '' })])).rejects.toMatchObject(refused('id_localidad', 'Seleccione Localidad'));
    await expect(update(catalog, [row({ id_punto_venta: '', id_almacen: '', proceso: '' })])).rejects.toMatchObject(refused('id_punto_venta', 'Seleccione Punto de Venta'));
    await expect(update(catalog, [row({ id_almacen: '', proceso: '' })])).rejects.toMatchObject(refused('id_almacen', 'Seleccione Almacen'));
    await expect(update(catalog, [row({ proceso: '' })])).rejects.toMatchObject(refused('proceso', 'Seleccione Proceso'));
  });

  it('S-MST-30 a localidad of another empresa, or an almacen outside the chosen punto de venta, is refused on its field', async () => {
    const { catalog } = make();
    await expect(update(catalog, [row({ id_localidad: '3', id_punto_venta: '3', id_almacen: '003' })])).rejects.toMatchObject(refused('id_localidad'));
    await expect(update(catalog, [row({ id_almacen: '001' })])).rejects.toMatchObject(refused('id_almacen'));
  });

  it('S-MST-30 a new almacen is stored active with the date of today, the proceso VENTA by default', async () => {
    const { catalog, children } = make();
    await update(catalog, [(({ proceso: _p, ...rest }) => rest)(row())], '000002');
    expect((await children.list('000002', 'almacenes')).items.map((r) => [r.estado, r.almacen, r.proceso, r.f_inicio, r.f_fin ?? ''])).toEqual([['A', 'ALMACEN ATE', 'VENTA', new Date().toISOString().slice(0, 10), '']]);
  });

  it('S-MOCK-43 the same active almacen and proceso answers 409 on the indexed field; the other proceso is accepted', async () => {
    const { catalog } = make();
    await expect(update(catalog, [row({ id_localidad: '1', id_punto_venta: '1', id_almacen: '001' })])).rejects.toMatchObject(refused('id_almacen', DUPLICATE, 409));
    await expect(update(catalog, [row({ proceso: 'DESPACHO' }), row({ proceso: 'DESPACHO' })])).rejects.toMatchObject({ status: 409, details: [{ field: 'almacenes[1].id_almacen', message: DUPLICATE }] });
    await expect(update(catalog, [row({ id_localidad: '1', id_punto_venta: '1', id_almacen: '001', proceso: 'DESPACHO' })])).resolves.toBeTruthy();
  });

  it('S-MD-9 once the first row is deactivated the same pair is accepted, in the same body or later; a PUT keeping its own values is accepted', async () => {
    const { catalog, children } = make();
    await expect(update(catalog, [{ op: 'A', id: '1', estado: 'D' }, row({ id_localidad: '1', id_punto_venta: '1', id_almacen: '001' })])).resolves.toBeTruthy();
    expect((await children.list(ITEM, 'almacenes')).items.map((r) => [r.estado, r.proceso])).toEqual([['D', 'VENTA'], ['D', 'DESPACHO'], ['A', 'VENTA']]);
    await expect(update(catalog, [{ op: 'A', id: '4', proceso: 'VENTA' }])).resolves.toBeTruthy();
  });

  it('R-MD-4 a deactivation closes the row with the date of today (F_FIN)', async () => {
    const { catalog, children } = make();
    await update(catalog, [{ op: 'A', id: '1', estado: 'D' }]);
    expect((await children.list(ITEM, 'almacenes')).items.map((r) => [r.id, r.estado, r.f_fin])).toEqual([['1', 'D', new Date().toISOString().slice(0, 10)], ['2', 'D', '2024-12-31']]);
  });
});
