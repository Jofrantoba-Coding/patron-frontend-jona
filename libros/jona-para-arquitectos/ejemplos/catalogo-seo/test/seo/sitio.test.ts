// @vitest-environment node
/**
 * La auditoría SEO contra los dos modos de entrega, con lo compilado (requiere `npm run build`,
 * con SITIO_URL sin definir):
 *   - estático: los archivos de dist/estatico, servidos como lo haría un alojamiento estático;
 *   - SSR: el servidor, con la plantilla y los estáticos de dist/client.
 * Y la prueba de que los dos entregan el mismo HTML.
 */
import { existsSync, readFileSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { crearRaizComposicion } from '../../src/servidor/crearRaizComposicion';
import { crearServidorEstatico } from '../../src/servidor/crearServidorEstatico';
import { crearServidorSsr } from '../../src/servidor/crearServidorSsr';
import { PAGINAS, suiteSeo, type FuenteSitio } from './suiteSeo';

const DIST = (carpeta: string) => fileURLToPath(new URL(`../../dist/${carpeta}`, import.meta.url));

async function fuenteHttp(servidor: Server): Promise<FuenteSitio> {
  await new Promise<void>((listo) => servidor.listen(0, '127.0.0.1', listo));
  const base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
  return {
    obtener: async (ruta) => {
      const respuesta = await fetch(`${base}${ruta}`);
      return { estado: respuesta.status, tipo: respuesta.headers.get('content-type'), cuerpo: await respuesta.text() };
    },
    cerrar: () => new Promise((listo) => servidor.close(() => listo())),
  };
}

const estatico = () => fuenteHttp(crearServidorEstatico(DIST('estatico')));
const ssr = () =>
  fuenteHttp(crearServidorSsr({ raiz: crearRaizComposicion({}), plantilla: readFileSync(`${DIST('client')}/index.html`, 'utf8'), dirEstaticos: DIST('client') }));

describe('lo compilado', () => {
  it('dist/client y dist/estatico existen (si falla: npm run build)', () => {
    expect([existsSync(`${DIST('client')}/index.html`), existsSync(`${DIST('estatico')}/index.html`)]).toEqual([true, true]);
  });
});

suiteSeo('sitio estático (dist/estatico)', estatico);
suiteSeo('servidor SSR', ssr);

describe('un código, dos modos de entrega', () => {
  it('cada página indexable y la página no encontrada tienen el mismo HTML en los dos modos', async () => {
    const [a, b] = await Promise.all([estatico(), ssr()]);
    try {
      const rutas = [...PAGINAS.filter((p) => p.indexable).map((p) => p.ruta), '/productos/NO-EXISTE'];
      for (const ruta of rutas) {
        const [deEstatico, deSsr] = await Promise.all([a.obtener(ruta), b.obtener(ruta)]);
        expect(deSsr.cuerpo, ruta).toBe(deEstatico.cuerpo);
      }
      const [sitemapA, sitemapB] = await Promise.all([a.obtener('/sitemap.xml'), b.obtener('/sitemap.xml')]);
      expect(sitemapB.cuerpo).toBe(sitemapA.cuerpo);
    } finally {
      await Promise.all([a.cerrar(), b.cerrar()]);
    }
  });

  it('la búsqueda difiere a propósito: el SSR la resuelve en la petición; el estático, en el navegador', async () => {
    const [a, b] = await Promise.all([estatico(), ssr()]);
    try {
      const [deEstatico, deSsr] = await Promise.all([a.obtener('/buscar?q=teclado'), b.obtener('/buscar?q=teclado')]);
      expect(deSsr.cuerpo).toContain('href="/productos/TEC-001"');
      expect(deEstatico.cuerpo).not.toContain('href="/productos/TEC-001"');
      expect([deEstatico.cuerpo, deSsr.cuerpo].every((html) => html.includes('<meta name="robots" content="noindex, follow" />'))).toBe(true);
    } finally {
      await Promise.all([a.cerrar(), b.cerrar()]);
    }
  });
});
