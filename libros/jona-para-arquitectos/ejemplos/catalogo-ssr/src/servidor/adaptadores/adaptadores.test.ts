// @vitest-environment node
// Los dos adaptadores pasan la suite de contrato del capítulo 14; el HTTP, además, reenvía las
// cabeceras de la petición que lo creó.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { contratoRepositorio } from '../../../test/contratoRepositorio';
import { arrancarServidorProductos, type ServidorProductos } from '../../../test/servidorProductos';
import { crearRepositorioHttp, ORIGEN_ADAPTADOR_HTTP } from './crearRepositorioHttp';
import { crearRepositorioMemoria } from './crearRepositorioMemoria';

let servidor: ServidorProductos;
beforeAll(async () => {
  servidor = await arrancarServidorProductos();
});
afterAll(() => servidor.cerrar());

contratoRepositorio('adaptador en memoria', () => crearRepositorioMemoria());
contratoRepositorio('adaptador HTTP', () => {
  servidor.vaciar();
  return crearRepositorioHttp({ baseUrl: servidor.url });
});

describe('adaptador HTTP en el servidor', () => {
  it('reenvía las cabeceras de la petición, omite las que no vinieron y se identifica con X-Origen', async () => {
    const enviadas: Array<Record<string, string>> = [];
    const repositorio = crearRepositorioHttp({
      baseUrl: 'http://api',
      cabeceras: { 'X-Usuario': 'ana', 'X-Traza': undefined },
      fetch: async (_url, init) => {
        enviadas.push(init?.headers as Record<string, string>);
        return Response.json([]);
      },
    });

    await repositorio.listar();

    expect(enviadas[0]).toEqual({ 'X-Usuario': 'ana', Accept: 'application/json', 'X-Origen': ORIGEN_ADAPTADOR_HTTP });
  });
});
