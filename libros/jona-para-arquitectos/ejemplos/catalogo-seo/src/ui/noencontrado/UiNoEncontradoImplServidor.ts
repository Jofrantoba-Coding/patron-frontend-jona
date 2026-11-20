// Implementación del servidor de la página «no encontrada»: solo metadatos. Nunca se indexa, y
// el estado 404 lo pone quien responde (resolverPagina.ts), no esta función.
import type { InterSitio, MetadatosNoIndexables } from '../../seo/InterMetadatosPagina';
import { UINOENCONTRADO_DEFAULTS, type DatosUiNoEncontrado } from './InterUiNoEncontrado';

export const DATOS_NO_ENCONTRADO: DatosUiNoEncontrado = {};

export function metadatosUiNoEncontrado(_datos: DatosUiNoEncontrado, sitio: InterSitio): MetadatosNoIndexables {
  return {
    titulo: `${UINOENCONTRADO_DEFAULTS.titulo} | ${sitio.nombre}`,
    descripcion: UINOENCONTRADO_DEFAULTS.mensaje,
    robots: 'noindex, follow',
    openGraph: { tipo: 'website' },
  };
}
