// Las rutas del sitio, en un solo lugar: las usan los enlaces de las vistas, el servidor que
// resuelve cada petición, el generador del sitio estático y el sitemap. Si cambia la forma de una
// ruta, cambia aquí, y los cuatro se mueven juntos.
import type { JLinkHref } from '@jona-libro/ds-atomico';

export const RUTA_INICIO = '/';
/** Resultados de búsqueda: `/buscar?q=texto`. */
export const RUTA_BUSQUEDA = '/buscar';
/** Índice JSON con las filas del catálogo: lo usa la búsqueda del sitio estático. */
export const RUTA_INDICE_BUSQUEDA = '/datos/productos.json';
export const RUTA_SITEMAP = '/sitemap.xml';
export const RUTA_ROBOTS = '/robots.txt';

const PREFIJO_PRODUCTO = '/productos/';

export const rutaProducto = (sku: string): JLinkHref => `${PREFIJO_PRODUCTO}${encodeURIComponent(sku)}`;

/** El SKU de una ruta de producto; undefined si la ruta no es de producto o no se puede decodificar. */
export function skuDeRuta(ruta: string): string | undefined {
  if (!ruta.startsWith(PREFIJO_PRODUCTO)) return undefined;
  const resto = ruta.slice(PREFIJO_PRODUCTO.length);
  if (resto === '' || resto.includes('/')) return undefined;
  try {
    return decodeURIComponent(resto);
  } catch {
    return undefined;
  }
}

/** `/productos/TEC-001/` y `/productos/TEC-001` son la misma ruta; la canónica no lleva la barra final. */
export const normalizarRuta = (ruta: string) => (ruta.length > 1 && ruta.endsWith('/') ? ruta.slice(0, -1) : ruta);

/** URL absoluta de una ruta del sitio. `base` no termina en barra: `https://catalogo.example`. */
export const urlAbsoluta = (base: string, ruta: string) => `${base}${ruta}`;
