// El único lugar que dibuja la cabeza de una página: del contrato de metadatos a etiquetas.
// Es texto y no React porque la cabeza no se hidrata: el cliente no la vuelve a dibujar.
import { serializarParaHtml } from '../compartido/datosIncrustados';
import type { InterMetadatosPagina } from './InterMetadatosPagina';

const ENTIDADES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Texto seguro dentro de un elemento o del valor de un atributo entre comillas dobles. */
export const escaparHtml = (texto: string) => texto.replace(/[&<>"']/g, (c) => ENTIDADES[c]);

const metaNombre = (nombre: string, contenido: string) => `<meta name="${nombre}" content="${escaparHtml(contenido)}" />`;
const metaPropiedad = (propiedad: string, contenido: string) => `<meta property="${propiedad}" content="${escaparHtml(contenido)}" />`;

export function renderizarCabeza(metadatos: InterMetadatosPagina): string {
  const { titulo, descripcion, canonica, robots, openGraph, jsonLd } = metadatos;
  const etiquetas = [
    `<title>${escaparHtml(titulo)}</title>`,
    metaNombre('description', descripcion),
    metaNombre('robots', robots),
    canonica && `<link rel="canonical" href="${escaparHtml(canonica)}" />`,
    metaPropiedad('og:type', openGraph.tipo),
    metaPropiedad('og:title', titulo),
    metaPropiedad('og:description', descripcion),
    canonica && metaPropiedad('og:url', canonica),
    openGraph.imagen && metaPropiedad('og:image', openGraph.imagen),
    // El mismo escape que los datos incrustados del capítulo 15: <, > y & como secuencias de JSON.
    jsonLd && `<script type="application/ld+json">${serializarParaHtml(jsonLd)}</script>`,
  ];
  return etiquetas.filter(Boolean).join('\n    ');
}
