// El sitemap y robots.txt, iguales en los dos modos. La lista de rutas indexables es una segunda
// fuente, aparte de la decisión `robots` de cada página: la auditoría comprueba que coincidan.
import { RUTA_INICIO, RUTA_SITEMAP, rutaProducto, urlAbsoluta } from '../compartido/rutas';
import type { InterSitio } from '../seo/InterMetadatosPagina';
import type { InterProductoRepositorio } from './InterProductoRepositorio';

/** Las rutas que se indexan: el catálogo y cada ficha. La búsqueda y el 404, no. */
export async function rutasIndexables(repositorio: InterProductoRepositorio): Promise<string[]> {
  return [RUTA_INICIO, ...(await repositorio.listar()).map((p) => rutaProducto(p.sku))];
}

const escaparXml = (texto: string) =>
  texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

export function generarSitemap(sitio: InterSitio, rutas: readonly string[]): string {
  const urls = rutas.map((ruta) => `  <url><loc>${escaparXml(urlAbsoluta(sitio.url, ruta))}</loc></url>`);
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n');
}

/**
 * robots.txt no bloquea /buscar: una página bloqueada no se descarga, y su `noindex` no se
 * llegaría a leer. Que no se indexe lo dice la propia página.
 */
export function generarRobots(sitio: InterSitio): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${urlAbsoluta(sitio.url, RUTA_SITEMAP)}`, ''].join('\n');
}
