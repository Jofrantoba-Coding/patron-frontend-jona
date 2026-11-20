// @vitest-environment node
/**
 * De punta a punta con lo compilado: `node dist/server/principal.js` en un puerto libre, como lo
 * arranca `npm start`. Se pide la página, se ejecuta una mutación y se vuelve a pedir.
 * Requiere `npm run build`.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const PRINCIPAL = fileURLToPath(new URL('../dist/server/principal.js', import.meta.url));

const procesos: ChildProcess[] = [];
const servidores: Server[] = [];
afterEach(async () => {
  procesos.splice(0).forEach((p) => p.kill());
  await Promise.all(servidores.splice(0).map((s) => new Promise((listo) => s.close(listo))));
});

/** Arranca el servidor compilado y espera la línea «listo en http://...». */
function arrancar(entorno: Record<string, string> = {}): Promise<string> {
  const proceso = spawn(process.execPath, [PRINCIPAL], { env: { ...process.env, PORT: '0', ...entorno }, stdio: ['ignore', 'pipe', 'pipe'] });
  procesos.push(proceso);
  return new Promise((listo, falla) => {
    proceso.stdout!.on('data', (parte) => {
      const url = /http:\/\/127\.0\.0\.1:\d+/.exec(String(parte));
      if (url) listo(url[0]);
    });
    proceso.on('exit', (codigo) => falla(new Error(`El servidor terminó con código ${codigo}`)));
  });
}

describe('el servidor compilado', () => {
  it('REPOSITORIO=memoria por defecto: la página trae los productos, y una baja por la ruta JSON se ve en la siguiente página', async () => {
    const url = await arrancar();

    const antes = await (await fetch(`${url}/`)).text();
    const baja = await fetch(`${url}/api/productos/p-1`, { method: 'DELETE' });
    const despues = await (await fetch(`${url}/`)).text();

    expect(antes).toContain('Teclado mecánico');
    expect(antes).toMatch(/<script type="module" crossorigin src="\/assets\/[^"]+\.js"><\/script>/);
    expect(baja.status).toBe(204);
    expect(despues).not.toContain('Teclado mecánico');
    expect(despues).toContain('Mouse inalámbrico');
  });

  it('sirve el bundle del cliente que la página referencia', async () => {
    const url = await arrancar();
    const html = await (await fetch(`${url}/`)).text();
    const script = /src="(\/assets\/[^"]+\.js)"/.exec(html)![1];

    const respuesta = await fetch(`${url}${script}`);

    expect([respuesta.status, respuesta.headers.get('content-type')]).toEqual([200, 'text/javascript; charset=utf-8']);
  });

  it('REPOSITORIO=http con API_URL: la página sale de la API de productos (por ejemplo, el BFF)', async () => {
    const api = createServer((peticion, respuesta) => {
      respuesta.writeHead(200, { 'Content-Type': 'application/json' });
      respuesta.end(JSON.stringify([{ id: 'srv-1', sku: 'API-001', nombre: `Desde la API para ${peticion.headers['x-usuario']}`, precio: 10, stock: 1 }]));
    });
    servidores.push(api);
    await new Promise<void>((listo) => api.listen(0, '127.0.0.1', listo));
    const url = await arrancar({ REPOSITORIO: 'http', API_URL: `http://127.0.0.1:${(api.address() as AddressInfo).port}` });

    const html = await (await fetch(`${url}/`, { headers: { 'X-Usuario': 'ana' } })).text();

    expect(html).toContain('Desde la API para ana');
    expect(html).toContain('S/ 10.00');
  });
});
