// @vitest-environment node
// Puntos de sustitución 2 y 3, y la raíz por petición: REPOSITORIO=memoria por defecto,
// REPOSITORIO=http con API_URL; con http, cada petición recibe su propio repositorio.
import { createServer, type IncomingHttpHeaders } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ORIGEN_ADAPTADOR_HTTP } from './adaptadores/crearRepositorioHttp';
import { crearRaizComposicion } from './crearRaizComposicion';

/** API de productos mínima: responde, con demora, un producto con el usuario que recibió. */
const recibidas: IncomingHttpHeaders[] = [];
const api = createServer((peticion, respuesta) => {
  recibidas.push(peticion.headers);
  const usuario = String(peticion.headers['x-usuario']);
  setTimeout(() => {
    respuesta.writeHead(200, { 'Content-Type': 'application/json' });
    respuesta.end(JSON.stringify([{ id: usuario, sku: 'USR-001', nombre: `Producto de ${usuario}`, precio: 1, stock: 1 }]));
  }, usuario === 'ana' ? 40 : 0);
});
let apiUrl: string;
beforeAll(async () => {
  await new Promise<void>((listo) => api.listen(0, '127.0.0.1', listo));
  apiUrl = `http://127.0.0.1:${(api.address() as AddressInfo).port}`;
});
afterAll(() => new Promise<void>((listo) => api.close(() => listo())));

describe('raíz de composición del servidor', () => {
  it('por defecto, REPOSITORIO=memoria con los datos de ejemplo, compartido por las peticiones', async () => {
    const raiz = crearRaizComposicion({});
    const a = raiz.repositorioPara({ traza: 't-1' });

    await a.eliminar('p-1');

    expect((await raiz.repositorioPara({ traza: 't-2' }).listar()).map((p) => p.sku)).toEqual(['MON-003', 'MOU-002']);
  });

  it('REPOSITORIO=http usa la API de API_URL y le reenvía el usuario y la traza de la petición', async () => {
    recibidas.length = 0;
    const raiz = crearRaizComposicion({ REPOSITORIO: 'http', API_URL: apiUrl });

    await raiz.repositorioPara({ usuario: 'beto', traza: 't-9' }).listar();

    expect(recibidas[0]).toMatchObject({ 'x-usuario': 'beto', 'x-traza': 't-9', 'x-origen': ORIGEN_ADAPTADOR_HTTP });
  });

  it('dos peticiones concurrentes no comparten repositorio: cada una lleva su usuario', async () => {
    const raiz = crearRaizComposicion({ REPOSITORIO: 'http', API_URL: apiUrl });
    const deAna = raiz.repositorioPara({ usuario: 'ana', traza: 't-a' });
    const deBeto = raiz.repositorioPara({ usuario: 'beto', traza: 't-b' });

    // La de ana empieza primero y termina última: si compartieran estado, se cruzarían.
    const [paraAna, paraBeto] = await Promise.all([deAna.listar(), deBeto.listar()]);

    expect(deAna).not.toBe(deBeto);
    expect([paraAna[0].nombre, paraBeto[0].nombre]).toEqual(['Producto de ana', 'Producto de beto']);
  });
});
