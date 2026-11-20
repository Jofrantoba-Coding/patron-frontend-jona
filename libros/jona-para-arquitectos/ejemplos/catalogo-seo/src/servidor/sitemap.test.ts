// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { crearRepositorioMemoria } from './adaptadores/crearRepositorioMemoria';
import { crearSitio, PRODUCTOS_DE_EJEMPLO } from './crearRaizComposicion';
import { generarRobots, generarSitemap, rutasIndexables } from './sitemap';

const SITIO = crearSitio('https://tienda.example');

describe('sitemap y robots.txt', () => {
  it('las rutas indexables son el catálogo y cada ficha: ni la búsqueda ni el 404', async () => {
    expect(await rutasIndexables(crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO))).toEqual(['/', '/productos/MON-003', '/productos/MOU-002', '/productos/TEC-001']);
  });

  it('el sitemap lista URLs absolutas, escapadas para XML', () => {
    expect(generarSitemap(SITIO, ['/', '/productos/A&B'])).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        '  <url><loc>https://tienda.example/</loc></url>\n' +
        '  <url><loc>https://tienda.example/productos/A&amp;B</loc></url>\n' +
        '</urlset>\n',
    );
  });

  it('robots.txt apunta al sitemap con URL absoluta y no bloquea la búsqueda', () => {
    const robots = generarRobots(SITIO);

    expect(robots).toContain('Sitemap: https://tienda.example/sitemap.xml');
    expect(robots).not.toMatch(/Disallow:\s*\/buscar/);
  });

  it('SITIO_URL debe ser un origen: sin ruta, http o https; la barra final se quita', () => {
    expect(crearSitio('https://tienda.example/').url).toBe('https://tienda.example');
    expect(crearSitio().url).toBe('https://catalogo.example');
    expect(() => crearSitio('tienda.example')).toThrow('no es una URL absoluta');
    expect(() => crearSitio('https://tienda.example/catalogo')).toThrow('debe ser el origen');
    expect(() => crearSitio('ftp://tienda.example')).toThrow('debe ser el origen');
  });
});
