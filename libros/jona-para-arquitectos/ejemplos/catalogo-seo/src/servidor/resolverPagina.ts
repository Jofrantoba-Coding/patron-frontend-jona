// El núcleo que comparten los dos modos de entrega: de una URL a la página y su estado HTTP.
// El servidor SSR lo llama en cada petición; el generador estático, una vez por ruta al compilar.
// El estado se decide aquí, antes de dibujar: un producto que no existe es un 404, nunca un 200
// con un mensaje de «no encontrado» (un «soft 404»).
import { RUTA_BUSQUEDA, RUTA_INICIO, normalizarRuta, skuDeRuta } from '../compartido/rutas';
import type { DatosPagina } from '../ui/InterPagina';
import { cargarUiCatalogo } from '../ui/catalogo/indexServidor';
import { DATOS_NO_ENCONTRADO } from '../ui/noencontrado/indexServidor';
import { cargarUiProducto } from '../ui/producto/indexServidor';
import type { InterProductoRepositorio } from './InterProductoRepositorio';

export interface ResultadoPagina {
  estado: 200 | 404;
  pagina: DatosPagina;
}

/** Una función, no una constante compartida: cada respuesta recibe su propio objeto. */
export const paginaNoEncontrada = (): ResultadoPagina => ({ estado: 404, pagina: { unidad: 'no-encontrado', datos: DATOS_NO_ENCONTRADO } });

export async function resolverPagina(url: URL, repositorio: InterProductoRepositorio): Promise<ResultadoPagina> {
  const ruta = normalizarRuta(url.pathname);
  if (ruta === RUTA_INICIO) {
    return { estado: 200, pagina: { unidad: 'catalogo', datos: await cargarUiCatalogo(repositorio, {}) } };
  }
  if (ruta === RUTA_BUSQUEDA) {
    const datos = await cargarUiCatalogo(repositorio, { termino: url.searchParams.get('q') ?? '' });
    return { estado: 200, pagina: { unidad: 'catalogo', datos } };
  }
  const sku = skuDeRuta(ruta);
  const producto = sku === undefined ? undefined : await cargarUiProducto(repositorio, sku);
  return producto ? { estado: 200, pagina: { unidad: 'producto', datos: producto } } : paginaNoEncontrada();
}
