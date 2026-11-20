// Modo de entrega 2: el servidor SSR sobre node:http. Por cada petición resuelve la página, pone el
// estado que decidió resolverPagina (200 o 404) y compone el documento con su cabeza. Sirve también
// el sitemap, robots.txt, el índice de búsqueda y los estáticos del cliente.
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { createServer } from 'node:http';
import { extname } from 'node:path';
import { RUTA_INDICE_BUSQUEDA, RUTA_ROBOTS, RUTA_SITEMAP } from '../compartido/rutas';
import { cargarUiCatalogo } from '../ui/catalogo/indexServidor';
import { leerDentroDe, tipoDe, TIPOS } from './archivos';
import { componerDocumento } from './componerDocumento';
import type { RaizComposicion } from './crearRaizComposicion';
import { resolverPagina } from './resolverPagina';
import { generarRobots, generarSitemap, rutasIndexables } from './sitemap';

export interface OpcionesServidorSsr {
  raiz: RaizComposicion;
  /** index.html con las marcas <!--ssr-cabeza-->, <!--ssr-html--> y <!--ssr-datos-->. */
  plantilla: string;
  /** Carpeta del cliente compilado (dist/client). Sin ella, no se sirven estáticos. */
  dirEstaticos?: string;
}

function responder(respuesta: ServerResponse, estado: number, tipo: string, cuerpo: string | Buffer) {
  respuesta.writeHead(estado, { 'Content-Type': tipo });
  respuesta.end(cuerpo);
}

export function crearServidorSsr({ raiz, plantilla, dirEstaticos }: OpcionesServidorSsr): Server {
  async function atender(peticion: IncomingMessage, respuesta: ServerResponse) {
    if (peticion.method !== 'GET') return responder(respuesta, 405, 'text/plain; charset=utf-8', 'Método no permitido');
    const url = new URL(peticion.url ?? '/', raiz.sitio.url);
    const repositorio = raiz.repositorioPara();

    if (url.pathname === RUTA_SITEMAP) return responder(respuesta, 200, TIPOS['.xml'], generarSitemap(raiz.sitio, await rutasIndexables(repositorio)));
    if (url.pathname === RUTA_ROBOTS) return responder(respuesta, 200, TIPOS['.txt'], generarRobots(raiz.sitio));
    if (url.pathname === RUTA_INDICE_BUSQUEDA) {
      return responder(respuesta, 200, TIPOS['.json'], JSON.stringify((await cargarUiCatalogo(repositorio, {})).productos));
    }
    // Una ruta con extensión es un archivo del cliente; las páginas no tienen extensión.
    if (extname(url.pathname) !== '') {
      const encontrado = dirEstaticos && !url.pathname.endsWith('.html') ? await leerDentroDe(dirEstaticos, url.pathname) : undefined;
      return encontrado
        ? responder(respuesta, 200, tipoDe(encontrado.archivo), encontrado.contenido)
        : responder(respuesta, 404, 'text/plain; charset=utf-8', 'No encontrado');
    }
    const { estado, pagina } = await resolverPagina(url, repositorio);
    return responder(respuesta, estado, TIPOS['.html'], componerDocumento(plantilla, pagina, raiz.sitio));
  }

  return createServer((peticion, respuesta) => {
    atender(peticion, respuesta).catch((error: unknown) => {
      console.error('SSR: error al atender', peticion.method, peticion.url, error);
      responder(respuesta, 502, 'text/plain; charset=utf-8', 'No disponible');
    });
  });
}
