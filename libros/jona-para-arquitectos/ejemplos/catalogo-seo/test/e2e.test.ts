// @vitest-environment node
/**
 * De punta a punta con lo compilado: `npm start` (el servidor SSR) y `npm run preview:estatico`
 * (el sitio estático), cada uno en un puerto libre. Requiere `npm run build`.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const proceso = (nombre: string) => fileURLToPath(new URL(`../dist/server/${nombre}.js`, import.meta.url));

const procesos: ChildProcess[] = [];
afterEach(() => {
  procesos.splice(0).forEach((p) => p.kill());
});

/** Arranca un proceso compilado y espera la línea «listo en http://...». */
function arrancar(nombre: string, entorno: Record<string, string> = {}): Promise<string> {
  const hijo = spawn(process.execPath, [proceso(nombre)], { env: { ...process.env, PORT: '0', ...entorno }, stdio: ['ignore', 'pipe', 'pipe'] });
  procesos.push(hijo);
  return new Promise((listo, falla) => {
    hijo.stdout!.on('data', (parte) => {
      const url = /http:\/\/127\.0\.0\.1:\d+/.exec(String(parte));
      if (url) listo(url[0]);
    });
    hijo.on('exit', (codigo) => falla(new Error(`${nombre} terminó con código ${codigo}`)));
  });
}

describe.each(['principal', 'previsualizarEstatico'])('el proceso compilado %s', (nombre) => {
  it('la ficha responde 200 y su bundle existe; un producto desconocido responde 404', async () => {
    const url = await arrancar(nombre);

    const ficha = await fetch(`${url}/productos/MOU-002`);
    const html = await ficha.text();
    const script = /src="(\/assets\/[^"]+\.js)"/.exec(html)![1];

    expect(ficha.status).toBe(200);
    expect(html).toContain('<h1 class="ds-fg ds-heading-xl">Mouse inalámbrico</h1>');
    expect((await fetch(`${url}${script}`)).status).toBe(200);
    expect((await fetch(`${url}/productos/NO-EXISTE`)).status).toBe(404);
  });
});

describe('SITIO_URL', () => {
  it('el servidor SSR toma la URL pública del entorno para las canónicas y el sitemap', async () => {
    const url = await arrancar('principal', { SITIO_URL: 'https://tienda.example' });

    expect(await (await fetch(`${url}/productos/TEC-001`)).text()).toContain('<link rel="canonical" href="https://tienda.example/productos/TEC-001" />');
    expect(await (await fetch(`${url}/robots.txt`)).text()).toContain('Sitemap: https://tienda.example/sitemap.xml');
  });

  it('una SITIO_URL que no es un origen detiene el proceso al arrancar', async () => {
    await expect(arrancar('principal', { SITIO_URL: 'tienda.example' })).rejects.toThrow('terminó con código 1');
  });
});
