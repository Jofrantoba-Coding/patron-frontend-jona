// El documento completo de una página: la cabeza (de los metadatos), el cuerpo (renderToString
// de la página) y los datos para hidratar. La misma función produce cada respuesta del servidor
// SSR y cada archivo del sitio estático: por eso el HTML de los dos modos es idéntico.
import { renderToString } from 'react-dom/server';
import { ID_DATOS, serializarParaHtml } from '../compartido/datosIncrustados';
import type { InterSitio } from '../seo/InterMetadatosPagina';
import { renderizarCabeza } from '../seo/renderizarCabeza';
import { Pagina, type DatosPagina } from '../ui';
import { metadatosDePagina } from '../ui/metadatosServidor';

/** Los huecos de index.html. */
export const MARCAS = { cabeza: '<!--ssr-cabeza-->', html: '<!--ssr-html-->', datos: '<!--ssr-datos-->' } as const;

/** Se reemplaza con funciones: un `$&` en un texto se interpretaría como patrón de String.replace. */
export function componerDocumento(plantilla: string, pagina: DatosPagina, sitio: InterSitio): string {
  const cabeza = renderizarCabeza(metadatosDePagina(pagina, sitio));
  const html = renderToString(<Pagina pagina={pagina} />);
  const datos = `<script id="${ID_DATOS}" type="application/json">${serializarParaHtml(pagina)}</script>`;
  return plantilla
    .replace(MARCAS.cabeza, () => cabeza)
    .replace(MARCAS.html, () => html)
    .replace(MARCAS.datos, () => datos);
}
