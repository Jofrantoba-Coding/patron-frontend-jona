// @vitest-environment node
// El adaptador HTTP contra un servidor de productos real (test/servidorProductos.ts), fuera del
// hexágono: otra implementación de la API, como lo sería el backend.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { arrancarServidorProductos, type ServidorProductos } from '../../../../test/servidorProductos';
import { ErrorRepositorio } from '../../../shared/api';
import { contratoRepositorio } from './contratoRepositorio';
import { crearRepositorioHttp } from './crearRepositorioHttp';

let servidor: ServidorProductos;
beforeAll(async () => {
  servidor = await arrancarServidorProductos();
});
afterAll(() => servidor.cerrar());

contratoRepositorio('adaptador HTTP', () => {
  servidor.vaciar();
  return crearRepositorioHttp({ baseUrl: servidor.url });
});

describe('adaptador HTTP: lo que no cubre la suite de contrato', () => {
  it('sin conexión, el error es de red, no un TypeError de fetch', async () => {
    const repositorio = crearRepositorioHttp({ baseUrl: 'http://127.0.0.1:9', fetch: () => Promise.reject(new TypeError('fetch failed')) });

    await expect(repositorio.listar()).rejects.toEqual(new ErrorRepositorio('red', 'Sin conexión con el servidor'));
  });

  it('un 500 del servidor también es de red, con el código en el mensaje', async () => {
    const repositorio = crearRepositorioHttp({ baseUrl: '', fetch: async () => new Response(null, { status: 500 }) });

    await expect(repositorio.listar()).rejects.toMatchObject({ tipo: 'red', message: 'HTTP 500' });
  });
});
