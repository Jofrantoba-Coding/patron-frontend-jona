// @vitest-environment node
// Los dos modos de entrega en el mismo proceso, sin compilar: el servidor SSR, el generador del
// sitio estático escribiendo en una carpeta temporal, y el servidor de archivos que lo sirve.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { MARCAS } from './componerDocumento';
import { crearRaizComposicion } from './crearRaizComposicion';
import { crearServidorEstatico } from './crearServidorEstatico';
import { crearServidorSsr } from './crearServidorSsr';
import { archivoDeRuta, generarSitioEstatico } from './generarSitioEstatico';

const PLANTILLA = `<!doctype html><html lang="es-PE"><head>${MARCAS.cabeza}</head><body><div id="raiz">${MARCAS.html}</div>${MARCAS.datos}</body></html>`;

const abiertos: Server[] = [];
afterEach(async () => {
  await Promise.all(abiertos.splice(0).map((s) => new Promise((listo) => s.close(listo))));
});

async function escuchar(servidor: Server): Promise<string> {
  abiertos.push(servidor);
  await new Promise<void>((listo) => servidor.listen(0, '127.0.0.1', listo));
  return `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
}

/** Un dist/client mínimo: la plantilla y un archivo del bundle. */
function clienteFalso(): string {
  const dir = mkdtempSync(join(tmpdir(), 'catalogo-seo-cliente-'));
  writeFileSync(join(dir, 'index.html'), PLANTILLA);
  mkdirSync(join(dir, 'assets'));
  writeFileSync(join(dir, 'assets', 'app.js'), 'console.log(1)');
  return dir;
}

describe('servidor SSR', () => {
  const arrancar = (dirEstaticos?: string) => escuchar(crearServidorSsr({ raiz: crearRaizComposicion({}), plantilla: PLANTILLA, dirEstaticos }));

  it('una ficha responde 200 con su cabeza; un producto desconocido, 404 con la página no encontrada', async () => {
    const url = await arrancar();

    const ficha = await fetch(`${url}/productos/TEC-001`);
    const desconocido = await fetch(`${url}/productos/NO-EXISTE`);

    expect([ficha.status, ficha.headers.get('content-type')]).toEqual([200, 'text/html; charset=utf-8']);
    expect(await ficha.text()).toContain('<link rel="canonical" href="https://catalogo.example/productos/TEC-001" />');
    expect(desconocido.status).toBe(404);
    expect(await desconocido.text()).toContain('<meta name="robots" content="noindex, follow" />');
  });

  it('sitemap.xml, robots.txt y el índice de búsqueda, con su tipo', async () => {
    const url = await arrancar();
    const tipos = await Promise.all(['/sitemap.xml', '/robots.txt', '/datos/productos.json'].map(async (r) => (await fetch(`${url}${r}`)).headers.get('content-type')));

    expect(tipos).toEqual(['application/xml; charset=utf-8', 'text/plain; charset=utf-8', 'application/json; charset=utf-8']);
  });

  it('sirve los estáticos del cliente, pero no la plantilla ni nada fuera de su carpeta', async () => {
    const url = await arrancar(clienteFalso());

    const estados = await Promise.all(['/assets/app.js', '/index.html', '/..%2Fpackage.json'].map(async (r) => (await fetch(`${url}${r}`)).status));

    expect(estados).toEqual([200, 404, 404]);
  });

  it('solo GET; si el repositorio falla, 502', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    onTestFinished(() => {
      vi.restoreAllMocks();
    });
    const raiz = crearRaizComposicion({});
    const repositorio = raiz.repositorioPara();
    vi.spyOn(repositorio, 'listar').mockRejectedValue(new Error('red'));
    const url = await escuchar(crearServidorSsr({ raiz, plantilla: PLANTILLA }));

    expect([(await fetch(`${url}/`, { method: 'POST' })).status, (await fetch(`${url}/`)).status]).toEqual([405, 502]);
  });
});

describe('sitio estático', () => {
  it('archivoDeRuta: un index.html por ruta', () => {
    expect(['/', '/productos/TEC-001', '/productos/A%20B', '/buscar'].map(archivoDeRuta)).toEqual([
      'index.html', 'productos/TEC-001/index.html', 'productos/A B/index.html', 'buscar/index.html',
    ]);
  });

  it('escribe las páginas, 404.html, sitemap, robots, el índice y los estáticos (sin la plantilla)', async () => {
    const dirSalida = join(mkdtempSync(join(tmpdir(), 'catalogo-seo-estatico-')), 'estatico');

    const escritos = await generarSitioEstatico({ raiz: crearRaizComposicion({ SITIO_URL: 'https://tienda.example' }), plantilla: PLANTILLA, dirCliente: clienteFalso(), dirSalida });

    expect(escritos).toEqual([
      'index.html', 'productos/MON-003/index.html', 'productos/MOU-002/index.html', 'productos/TEC-001/index.html',
      'buscar/index.html', '404.html', 'sitemap.xml', 'robots.txt', 'datos/productos.json',
    ]);
    expect(readFileSync(join(dirSalida, 'assets', 'app.js'), 'utf8')).toBe('console.log(1)');
    expect(readFileSync(join(dirSalida, 'index.html'), 'utf8')).toContain('<link rel="canonical" href="https://tienda.example/" />');
    expect(readFileSync(join(dirSalida, 'robots.txt'), 'utf8')).toContain('Sitemap: https://tienda.example/sitemap.xml');
  });

  it('el servidor de archivos: carpeta por su index.html, y lo que no existe es 404 con 404.html', async () => {
    const dirSalida = join(mkdtempSync(join(tmpdir(), 'catalogo-seo-estatico-')), 'estatico');
    await generarSitioEstatico({ raiz: crearRaizComposicion({}), plantilla: PLANTILLA, dirCliente: clienteFalso(), dirSalida });
    const url = await escuchar(crearServidorEstatico(dirSalida));

    const ficha = await fetch(`${url}/productos/TEC-001`);
    const desconocido = await fetch(`${url}/productos/NO-EXISTE`);

    expect(ficha.status).toBe(200);
    expect(await ficha.text()).toBe(readFileSync(join(dirSalida, 'productos/TEC-001/index.html'), 'utf8'));
    expect(desconocido.status).toBe(404);
    expect(await desconocido.text()).toBe(readFileSync(join(dirSalida, '404.html'), 'utf8'));
    expect((await fetch(`${url}/..%2F..%2Fpackage.json`)).status).toBe(404);
    expect(existsSync(join(dirSalida, 'index.html'))).toBe(true);
  });
});
