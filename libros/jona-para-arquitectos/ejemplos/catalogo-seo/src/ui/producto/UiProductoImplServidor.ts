// Implementación del servidor de la ficha: carga por SKU y produce los metadatos como función pura
// de los datos y del sitio. Sin DOM, sin React: se prueba con datos literales.
import { rutaProducto, urlAbsoluta } from '../../compartido/rutas';
import type { MetadatosIndexables, InterSitio } from '../../seo/InterMetadatosPagina';
import type { InterProductoRepositorio } from '../../servidor/InterProductoRepositorio';
import type { DatosUiProducto } from './InterUiProducto';

/** undefined si no existe: quien llama decide la respuesta (404), no esta función. */
export async function cargarUiProducto(repositorio: InterProductoRepositorio, sku: string): Promise<DatosUiProducto | undefined> {
  const producto = await repositorio.obtenerPorSku(sku);
  if (!producto) return undefined;
  const { nombre, descripcion, precio, stock, imagen } = producto;
  return { sku: producto.sku, nombre, descripcion, precio, precioTexto: `S/ ${precio.toFixed(2)}`, stock, imagen };
}

/** Una ficha siempre se indexa: el tipo de retorno lo dice, y exige la canónica. */
export function metadatosUiProducto(datos: DatosUiProducto, sitio: InterSitio): MetadatosIndexables {
  const canonica = urlAbsoluta(sitio.url, rutaProducto(datos.sku));
  const imagen = urlAbsoluta(sitio.url, datos.imagen.src);
  return {
    titulo: `${datos.nombre} (${datos.sku}) | ${sitio.nombre}`,
    descripcion: datos.descripcion,
    canonica,
    robots: 'index, follow',
    openGraph: { tipo: 'product', imagen },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: datos.nombre,
      sku: datos.sku,
      description: datos.descripcion,
      image: imagen,
      url: canonica,
      offers: {
        '@type': 'Offer',
        price: datos.precio.toFixed(2),
        priceCurrency: 'PEN',
        availability: datos.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: canonica,
      },
    },
  };
}
