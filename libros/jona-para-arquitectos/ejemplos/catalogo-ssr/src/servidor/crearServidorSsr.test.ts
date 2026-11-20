// @vitest-environment node
// El servidor SSR en el mismo proceso: la página, las rutas JSON, los estáticos y la raíz por
// petición bajo concurrencia, de la petición HTTP a la API de productos.
import { mkdtempSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { ID_DATOS } from '../compartido/datosIncrustados';
import { crearRaizComposicion } from './crearRaizComposicion';
import { crearServidorSsr, type OpcionesServidorSsr } from './crearServidorSsr';
import { MARCAS } from './renderizarPagina';

const PLANTILLA = `<html><body><div id="raiz">${MARCAS.html}</div>${MARCAS.datos}</body></html>`;

const abiertos: Server[] = [];
afterEach(async () => {
  await Promise.all(abiertos.splice(0).map((s) => new Promise((listo) => s.close(listo))));
});

async function escuchar(servidor: Server): Promise<string> {
  abiertos.push(servidor);
  await new Promise<void>((listo) => servidor.listen(0, '127.0.0.1', listo));
  return `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
}

const arrancar = (opciones: Partial<OpcionesServidorSsr> = {}) =>
  escuchar(crearServidorSsr({ raiz: crearRaizComposicion({}), plantilla: PLANTILLA, ...opciones }));

describe('servidor SSR', () => {
  it('GET / dibuja la página con los productos y los datos incrustados para hidratar', async () => {
    const url = await arrancar();

    const html = await (await fetch(`${url}/?q=mouse`)).text();

    expect(html).toContain('Mouse inalámbrico');
    expect(html).not.toContain('Teclado mecánico');
    expect(html).toContain(`<script id="${ID_DATOS}" type="application/json">{"termino":"mouse"`);
  });

  it('GET /api/catalogo devuelve la misma cara de datos en JSON', async () => {
    const url = await arrancar();

    const respuesta = await fetch(`${url}/api/catalogo?q=tec`);

    expect(respuesta.headers.get('content-type')).toContain('application/json');
    expect(await respuesta.json()).toEqual({ termino: 'tec', productos: [{ id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 'S/ 120.00', stock: 8 }] });
  });

  it('DELETE /api/productos/:id responde 204, y 404 si ya no existe', async () => {
    const url = await arrancar();
    const borrar = () => fetch(`${url}/api/productos/p-1`, { method: 'DELETE' });

    expect([(await borrar()).status, (await borrar()).status]).toEqual([204, 404]);
  });

  it('si la API falla al borrar, responde 502', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    onTestFinished(() => {
      vi.restoreAllMocks();
    });
    const url = await arrancar({ raiz: crearRaizComposicion({ REPOSITORIO: 'http', API_URL: 'http://127.0.0.1:9' }) });

    expect((await fetch(`${url}/api/productos/p-1`, { method: 'DELETE' })).status).toBe(502);
  });

  it('sirve los estáticos del cliente, y nada fuera de su carpeta', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'catalogo-ssr-'));
    writeFileSync(join(dir, 'app.js'), 'console.log(1)');
    const url = await arrancar({ dirEstaticos: dir });

    const archivo = await fetch(`${url}/app.js`);
    const fuera = await fetch(`${url}/..%2Fpackage.json`);

    expect([archivo.status, archivo.headers.get('content-type'), await archivo.text()]).toEqual([200, 'text/javascript; charset=utf-8', 'console.log(1)']);
    expect(fuera.status).toBe(404);
  });

  it('dos peticiones concurrentes de usuarios distintos reciben cada una lo suyo', async () => {
    const api = await escuchar(createServer((peticion, respuesta) => {
      const usuario = String(peticion.headers['x-usuario']);
      setTimeout(() => {
        respuesta.writeHead(200, { 'Content-Type': 'application/json' });
        respuesta.end(JSON.stringify([{ id: 'u', sku: 'USR-001', nombre: `Lista de ${usuario}`, precio: 1, stock: 1 }]));
      }, usuario === 'ana' ? 40 : 0);
    }));
    const url = await arrancar({ raiz: crearRaizComposicion({ REPOSITORIO: 'http', API_URL: api }) });
    const pagina = (usuario: string) => fetch(`${url}/`, { headers: { 'X-Usuario': usuario } }).then((r) => r.text());

    const [deAna, deBeto] = await Promise.all([pagina('ana'), pagina('beto')]);

    expect([deAna.includes('Lista de ana'), deAna.includes('Lista de beto')]).toEqual([true, false]);
    expect([deBeto.includes('Lista de beto'), deBeto.includes('Lista de ana')]).toEqual([true, false]);
  });
});
