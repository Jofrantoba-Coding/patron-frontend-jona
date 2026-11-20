// @vitest-environment node
// El adaptador del cliente contra el servidor SSR de verdad (en este proceso): el mismo par de
// rutas JSON que usa el navegador.
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { crearRaizComposicion } from '../servidor/crearRaizComposicion';
import { crearServidorSsr } from '../servidor/crearServidorSsr';
import { crearServicioCatalogoFetch } from './crearServicioCatalogoFetch';

let servidor: Server;
let baseUrl: string;
beforeAll(async () => {
  servidor = crearServidorSsr({ raiz: crearRaizComposicion({}), plantilla: '' });
  await new Promise<void>((listo) => servidor.listen(0, '127.0.0.1', listo));
  baseUrl = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
});
afterAll(() => new Promise<void>((listo) => servidor.close(() => listo())));

describe('servicio del cliente sobre las rutas JSON del servidor SSR', () => {
  it('consultar trae la cara de datos; eliminar distingue eliminado de no-encontrado', async () => {
    const servicio = crearServicioCatalogoFetch({ baseUrl });

    expect((await servicio.consultar('mon')).productos.map((p) => p.sku)).toEqual(['MON-003']);
    expect([await servicio.eliminar('p-3'), await servicio.eliminar('p-3')]).toEqual(['eliminado', 'no-encontrado']);
  });

  it('cualquier otro estado rechaza', async () => {
    const servicio = crearServicioCatalogoFetch({ fetch: async () => new Response(null, { status: 502 }) });

    await expect(servicio.eliminar('p-1')).rejects.toThrow('HTTP 502');
    await expect(servicio.consultar('')).rejects.toThrow('HTTP 502');
  });
});
