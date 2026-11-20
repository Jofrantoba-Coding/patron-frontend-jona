// Implementación del servidor: carga por el puerto, llena la cara de datos y, como función pura de
// esos datos y del sitio, produce los metadatos de la página. La comparten el servidor SSR y el
// generador del sitio estático.
import { RUTA_INICIO, rutaProducto, urlAbsoluta } from '../../compartido/rutas';
import type { Producto } from '../../dominio/Producto';
import type { InterMetadatosPagina, InterSitio } from '../../seo/InterMetadatosPagina';
import type { InterProductoRepositorio } from '../../servidor/InterProductoRepositorio';
import type { DatosUiCatalogo, FilaProductoUi } from './InterUiCatalogo';

export interface PeticionUiCatalogo {
  /** Ausente: el catálogo completo. Presente (aunque sea vacío): una búsqueda. */
  termino?: string;
}

export const aFila = (producto: Producto): FilaProductoUi => ({
  sku: producto.sku,
  nombre: producto.nombre,
  precio: `S/ ${producto.precio.toFixed(2)}`,
  disponible: producto.stock > 0,
  imagen: producto.imagen,
});

/**
 * El catálogo no atrapa el error del repositorio: una página que se indexa no responde 200 con un
 * aviso de error en lugar del contenido. Falla la petición (SSR, 502) o la compilación (estático).
 * La búsqueda, que no se indexa, sí sale con su aviso.
 */
export async function cargarUiCatalogo(repositorio: InterProductoRepositorio, peticion: PeticionUiCatalogo): Promise<DatosUiCatalogo> {
  if (peticion.termino === undefined) return { productos: (await repositorio.listar()).map(aFila) };
  const termino = peticion.termino.trim();
  if (termino === '') return { termino, productos: [] };
  try {
    return { termino, productos: (await repositorio.listar(termino)).map(aFila) };
  } catch {
    return { termino, productos: [], aviso: 'No se pudo buscar en el catálogo' };
  }
}

/**
 * Metadatos del catálogo y de la búsqueda.
 *
 * La búsqueda no se indexa: cada texto posible es una URL distinta, y todas repiten contenido de
 * las fichas de producto, que sí se indexan. `noindex, follow` deja que sus enlaces a las fichas
 * se sigan. Tampoco se bloquea en robots.txt: una página bloqueada no se descarga, y entonces su
 * noindex no se lee.
 */
export function metadatosUiCatalogo(datos: DatosUiCatalogo, sitio: InterSitio): InterMetadatosPagina {
  if (datos.termino !== undefined) {
    return {
      titulo: datos.termino ? `Buscar «${datos.termino}» | ${sitio.nombre}` : `Buscar productos | ${sitio.nombre}`,
      descripcion: `Resultados de búsqueda en el catálogo de ${sitio.nombre}.`,
      robots: 'noindex, follow',
      openGraph: { tipo: 'website' },
    };
  }
  const canonica = urlAbsoluta(sitio.url, RUTA_INICIO);
  return {
    titulo: `Catálogo de productos | ${sitio.nombre}`,
    descripcion: `${datos.productos.length} productos con precio en soles y disponibilidad al día: ${datos.productos.map((p) => p.nombre).join(', ')}.`,
    canonica,
    robots: 'index, follow',
    openGraph: { tipo: 'website' },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      url: canonica,
      itemListElement: datos.productos.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.nombre,
        url: urlAbsoluta(sitio.url, rutaProducto(p.sku)),
      })),
    },
  };
}
