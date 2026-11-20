// La página del servidor: renderToString de la entrada y los datos incrustados en la plantilla.
// renderToString y no renderToPipeableStream: los datos se cargan antes de dibujar (la
// Implementación del servidor es una función que se espera), no hay límites de Suspense que
// valga la pena enviar antes, y el código de estado se decide antes de escribir el primer byte.
import { renderToString } from 'react-dom/server';
import { ID_DATOS, serializarParaHtml } from '../compartido/datosIncrustados';
import { UiCatalogo, type DatosUiCatalogo } from '../ui/catalogo';

/** Los huecos de index.html. */
export const MARCAS = { html: '<!--ssr-html-->', datos: '<!--ssr-datos-->' } as const;

/** El HTML de la pantalla: la entrada sin servicio, porque en el servidor no hay eventos. */
export function renderizarCatalogo(datos: DatosUiCatalogo): string {
  return renderToString(<UiCatalogo datos={datos} />);
}

/**
 * La plantilla con el HTML y los datos. Se reemplaza con funciones: con un texto como reemplazo,
 * un `$&` o un `$'` en el nombre de un producto se interpretaría como patrón de String.replace.
 */
export function componerPagina(plantilla: string, datos: DatosUiCatalogo): string {
  const html = renderizarCatalogo(datos);
  const script = `<script id="${ID_DATOS}" type="application/json">${serializarParaHtml(datos)}</script>`;
  return plantilla.replace(MARCAS.html, () => html).replace(MARCAS.datos, () => script);
}
