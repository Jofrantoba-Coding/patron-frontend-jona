// @vitest-environment node
/**
 * Lo compilado: los tres procesos del servidor, el cliente y el sitio estático completo. El bundle
 * del cliente no lleva lo que solo hace el servidor (el JSON-LD de la oferta, el sitemap); el del
 * servidor sí, así que la búsqueda encuentra lo que busca. Requiere `npm run build`.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ID_DATOS } from '../src/compartido/datosIncrustados';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

const archivos = (carpeta: string) =>
  readdirSync(join(DIST, carpeta), { recursive: true, encoding: 'utf8' })
    .map((a) => a.replaceAll('\\', '/'))
    .filter((a) => /\.\w+$/.test(a))
    .sort();

const codigo = (carpeta: string) =>
  archivos(carpeta)
    .filter((a) => a.endsWith('.js'))
    .map((a) => readFileSync(join(DIST, carpeta, a), 'utf8'))
    .join('\n');

/** Lo que solo existe en el servidor: el JSON-LD de la oferta y el espacio de nombres del sitemap. */
const SOLO_SERVIDOR = ['priceCurrency', 'sitemaps.org/schemas/sitemap'];

describe('los artefactos de npm run build', () => {
  it('los tres procesos del servidor existen (si falla: npm run build)', () => {
    expect(['principal.js', 'generarEstatico.js', 'previsualizarEstatico.js'].map((a) => existsSync(join(DIST, 'server', a)))).toEqual([true, true, true]);
  });

  it('dist/estatico: un index.html por ruta, 404.html, sitemap, robots, el índice de búsqueda, imágenes y bundle', () => {
    const lista = archivos('estatico');

    expect(lista.filter((a) => !a.startsWith('assets/'))).toEqual([
      '404.html',
      'buscar/index.html',
      'datos/productos.json',
      'img/productos/MON-003.svg',
      'img/productos/MOU-002.svg',
      'img/productos/TEC-001.svg',
      'index.html',
      'productos/MON-003/index.html',
      'productos/MOU-002/index.html',
      'productos/TEC-001/index.html',
      'robots.txt',
      'sitemap.xml',
    ]);
    expect(lista.filter((a) => a.startsWith('assets/')).map((a) => a.split('.').pop())).toEqual(['css', 'js']);
  });

  it('ninguna página estática dejó un hueco de la plantilla sin llenar', () => {
    const paginas = archivos('estatico').filter((a) => a.endsWith('.html'));

    expect(paginas.filter((a) => readFileSync(join(DIST, 'estatico', a), 'utf8').includes('<!--ssr-'))).toEqual([]);
  });

  it('el bundle del cliente es el de esta aplicación, y no lleva código que solo corre en el servidor', () => {
    const cliente = codigo('client');

    expect(cliente).toContain(ID_DATOS);
    expect(SOLO_SERVIDOR.filter((marca) => cliente.includes(marca))).toEqual([]);
  });

  it('la búsqueda no es vacía: el bundle del servidor sí los contiene', () => {
    const servidor = codigo('server');

    expect(SOLO_SERVIDOR.filter((marca) => servidor.includes(marca))).toEqual(SOLO_SERVIDOR);
  });
});
