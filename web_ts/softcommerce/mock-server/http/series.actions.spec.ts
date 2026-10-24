import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { todayIso } from '../core/dates.js';
import { useTestServer } from './test-server';

const server = useTestServer({ dataDir: fileURLToPath(new URL('../data', import.meta.url)) });
const call = (method: string, path: string, body?: unknown) => server.call(method, path, { tenant: 'demo', body, headers: { 'X-Empresa-Id': '1', 'X-User-Id': '1' } });
const LITERAL = 'Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.';
const F001 = { id_punto_venta: '1', id_tipo_doc: '01', id_correlativo: '00001' };
const activate = (user: string, input: Record<string, unknown>) => call('POST', `/v1/usuarios/${user}/series/actions/activate`, input);

describe('S-MOCK-56 / S-PRM-12 activate creates the authorization (collection form)', () => {
  it('creates an active row for the pair, derives the localidad from the punto de venta and stamps today', async () => {
    const res = await activate('1', F001);
    expect(res.status).toBe(200);
    expect(res.body.row).toMatchObject({ id_usuario: '1', id_localidad: '1', id_punto_venta: '1', id_tipo_doc: '01', id_correlativo: '00001', habilitar: true, fecha_inicio: todayIso(), fecha_fin: '', serie: 'F001', id_empresa: '1' });
    expect(res.body.message).toBe('Serie autorizada');
    expect((await call('GET', '/v1/usuarios/1/series')).body.items.map((r: any) => r.id_correlativo)).toContain('00001');
  });

  it('takes the Fecha de Inicio of the dialog, and refuses a date that is not real', async () => {
    expect((await activate('1', { ...F001, fecha_inicio: '2026-07-01' })).body.row.fecha_inicio).toBe('2026-07-01');
    const bad = await activate('1', { ...F001, fecha_inicio: '31/02/2026' });
    expect([bad.status, bad.body.details.map((d: any) => d.field)]).toEqual([422, ['fecha_inicio']]);
  });

  it('checks the pair with the W2 chain: a serie that is not of the punto de venta is a 422', async () => {
    const res = await activate('1', { ...F001, id_correlativo: '00004' });
    expect([res.status, res.body.details.map((d: any) => d.field)]).toEqual([422, ['id_correlativo']]);
    expect((await activate('1', { id_punto_venta: '1', id_tipo_doc: '01' })).status).toBe(422);
  });
});

describe('S-PRM-15 the W2 unique key is shared', () => {
  it('409 with the W2 literal over an ACTIVE pair of the same user', async () => {
    const res = await activate('2', F001);
    expect([res.status, res.body.code, res.body.message]).toEqual([409, 'ACTION_NOT_ALLOWED', LITERAL]);
    expect(res.body.details).toEqual([{ field: 'id_correlativo', code: 'DUPLICATE', message: LITERAL }]);
    expect((await call('GET', '/v1/usuarios/2/series')).body.items).toHaveLength(2);
  });

  it('re-activates a deactivated pair: same row, new fecha_inicio, fecha_fin cleared', async () => {
    const res = await activate('1', { id_punto_venta: '2', id_tipo_doc: '01', id_correlativo: '00004', fecha_inicio: '2026-08-01' });
    expect(res.status).toBe(200);
    expect(res.body.row).toMatchObject({ id_usuario_correlativo: '00003', habilitar: true, fecha_inicio: '2026-08-01', fecha_fin: '' });
    expect((await call('GET', '/v1/usuarios/1/series')).body.items).toHaveLength(1);
  });
});

describe('S-PRM-13 deactivate (row form)', () => {
  const deactivate = (user: string, id: string) => call('POST', `/v1/usuarios/${user}/series/${id}/actions/deactivate`);

  it('turns the row deactivated with fecha fin today and keeps it listed', async () => {
    const res = await deactivate('2', '00001');
    expect(res.status).toBe(200);
    expect(res.body.row).toMatchObject({ id_usuario_correlativo: '00001', habilitar: false, fecha_fin: todayIso() });
    expect(res.body.message).toBe('Serie desactivada');
    expect((await call('GET', '/v1/usuarios/2/series')).body.items.map((r: any) => r.habilitar)).toEqual([false, true]);
  });

  it('409 on a row that is already deactivated, 404 on a row of another usuario', async () => {
    expect((await deactivate('1', '00003')).status).toBe(409);
    expect((await deactivate('1', '00001')).status).toBe(404);
  });
});

describe('S-PRM-14 / R-PRM-7 the W2 screen and Autorizar Series share the rows', () => {
  const W2 = { id_usuario: '1', id_localidad: '1', id_punto_venta: '1', id_tipo_doc: '01', id_correlativo: '00001', habilitar: true };

  it('a W2 create is an authorization starting today, whatever dates the body carries', async () => {
    const res = await call('POST', '/v1/usuario-correlativos', { ...W2, fecha_inicio: '2001-01-01', fecha_fin: '2001-02-01' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ fecha_inicio: todayIso(), fecha_fin: '' });
    expect((await call('GET', '/v1/usuarios/1/series')).body.items.map((r: any) => r.id_correlativo)).toContain('00001');
  });

  it('habilitar false in W2 shows deactivated in the series (dates kept), and a W2 logical delete removes the row from them', async () => {
    expect((await call('PUT', '/v1/usuario-correlativos/00002', { id_usuario: '2', id_localidad: '1', id_punto_venta: '1', id_tipo_doc: 'TI', id_correlativo: '00002', habilitar: false })).status).toBe(200);
    expect((await call('GET', '/v1/usuarios/2/series')).body.items.map((r: any) => [r.id_usuario_correlativo, r.habilitar, r.fecha_inicio])).toEqual([['00001', true, '2026-01-05'], ['00002', false, '2026-01-05']]);
    expect((await call('DELETE', '/v1/usuario-correlativos/00001')).status).toBe(204);
    expect((await call('GET', '/v1/usuarios/2/series')).body.items.map((r: any) => r.id_usuario_correlativo)).toEqual(['00002']);
  });
});
