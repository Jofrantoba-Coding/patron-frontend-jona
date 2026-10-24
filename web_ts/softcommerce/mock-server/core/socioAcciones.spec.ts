import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { useTestServer } from '../http/test-server';

const server = useTestServer({ dataDir: fileURLToPath(new URL('../data', import.meta.url)) });
const call = (method: string, body?: unknown, tenant: string | undefined = 'demo') => server.call(method, '/v1/socio-acciones', { tenant, body });
const stored = async () => (await call('GET')).body;
const ACTIVE_PRICE = { id: '2', op: 'A', estado: 'D', fecha_fin: '2026-12-01' };
const NEW_PRICE = { op: 'I', precio: 15, fecha_inicio: '2026-12-02' };

describe('R-MOCK-26 GET returns every price and socio row, active and deactivated', () => {
  it('lists the seeded rows with the socio name', async () => {
    const res = await call('GET');

    expect(res.status).toBe(200);
    expect(res.body.precios.map((r: any) => [r.id_accion_precio, r.estado])).toEqual([['1', 'D'], ['2', 'A']]);
    expect(res.body.socios).toEqual([
      expect.objectContaining({ id_accion_socio: '1', id_socio: '1', numero_doc: '45871236', socio: 'RAMOS DIAZ LUIS', estado: 'A', precio: 12.5, cantidad: 100 }),
    ]);
  });

  it('needs the tenant header', async () => {
    expect((await server.call('GET', '/v1/socio-acciones')).status).toBe(400);
  });
});

describe('S-MOCK-54 PUT is one atomic composite', () => {
  it('a second active price answers 409 `No se Puede Agregar mas de un Precio` and nothing changes', async () => {
    const before = await stored();
    const res = await call('PUT', { precios: [NEW_PRICE], socios: [] });

    expect([res.status, res.body.message]).toEqual([409, 'No se Puede Agregar mas de un Precio']);
    expect(await stored()).toEqual(before);
  });

  it('no active price in the final state answers 422 `Ingrese Precio` and nothing changes', async () => {
    const before = await stored();
    const res = await call('PUT', { precios: [ACTIVE_PRICE], socios: [] });

    expect([res.status, res.body.details[0]]).toEqual([422, expect.objectContaining({ field: 'precios', message: 'Ingrese Precio' })]);
    expect(await stored()).toEqual(before);
  });

  it('a blank price on a new row answers 422 `Ingrese Precio`', async () => {
    const res = await call('PUT', { precios: [ACTIVE_PRICE, { op: 'I', fecha_inicio: '2026-12-02' }], socios: [] });

    expect([res.status, res.body.details[0].message]).toEqual([422, 'Ingrese Precio']);
  });

  it('deactivates the price and activates a new one in the same body: 200 with `message`, the price applied to every active socio', async () => {
    const res = await call('PUT', { precios: [ACTIVE_PRICE, NEW_PRICE], socios: [{ op: 'I', id_socio: '2', cantidad: 5, fecha_inicio: '2026-12-02' }] });

    expect(res.status).toBe(200);
    expect(typeof res.body.message).toBe('string');
    const after = await stored();
    expect(after.precios.map((r: any) => [r.id_accion_precio, r.estado, r.precio, r.fecha_fin])).toEqual([
      ['1', 'D', 10, '2026-05-31'], ['2', 'D', 12.5, '2026-12-01'], ['3', 'A', 15, ''],
    ]);
    expect(after.socios.map((r: any) => [r.id_socio, r.precio, r.cantidad])).toEqual([['1', 15, 100], ['2', 15, 5]]);
    expect(res.body.precios).toEqual(after.precios);
    expect(res.body.socios).toEqual(after.socios);
  });

  it('a new socio takes the current active price and keeps its cantidad', async () => {
    await call('PUT', { precios: [], socios: [{ op: 'I', id_socio: '2', cantidad: 7, fecha_inicio: '2026-12-02' }] });

    expect((await stored()).socios[1]).toMatchObject({ id_socio: '2', estado: 'A', precio: 12.5, cantidad: 7, fecha_fin: '' });
  });

  it('a socio is active at most once: 409 `Socio ya esta activado`', async () => {
    const before = await stored();
    const res = await call('PUT', { precios: [], socios: [{ op: 'I', id_socio: '1', cantidad: 1 }] });

    expect([res.status, res.body.message]).toEqual([409, 'Socio ya esta activado']);
    expect(await stored()).toEqual(before);
  });

  it('cantidad is required: 422 `Ingrese Cantidad`', async () => {
    const res = await call('PUT', { precios: [], socios: [{ op: 'I', id_socio: '2' }] });

    expect([res.status, res.body.details[0]]).toEqual([422, expect.objectContaining({ field: 'socios[0].cantidad', message: 'Ingrese Cantidad' })]);
  });

  it('fecha_fin must be after fecha_inicio: 422 `Fecha es menor a fecha inicial`, also on the same day', async () => {
    for (const fecha_fin of ['2026-05-31', '2026-06-01']) {
      const res = await call('PUT', { precios: [{ ...ACTIVE_PRICE, fecha_fin }, NEW_PRICE], socios: [] });
      expect([res.status, res.body.details[0].message]).toEqual([422, 'Fecha es menor a fecha inicial']);
    }
  });

  it('is atomic: a valid price change is not kept when a socio op fails', async () => {
    const before = await stored();
    const res = await call('PUT', { precios: [ACTIVE_PRICE, NEW_PRICE], socios: [{ op: 'I', id_socio: '2' }] });

    expect(res.status).toBe(422);
    expect(await stored()).toEqual(before);
  });

  it('refuses an unknown op, an unknown id and an unknown socio', async () => {
    expect((await call('PUT', { precios: [{ op: 'X' }], socios: [] })).status).toBe(422);
    expect((await call('PUT', { precios: [{ id: '99', op: 'A', estado: 'D' }], socios: [] })).status).toBe(422);
    expect((await call('PUT', { precios: [], socios: [{ op: 'I', id_socio: '99', cantidad: 1 }] })).status).toBe(422);
  });

  it('an empty body changes nothing and succeeds while a price is active', async () => {
    const before = await stored();

    expect((await call('PUT', {})).status).toBe(200);
    expect(await stored()).toEqual(before);
  });
});
