// El servidor SSR sobre node:http. Dibuja la página, y sirve las rutas JSON con las que el cliente
// muta y vuelve a consultar: para esta pantalla hace de BFF. En cada petición crea el repositorio
// con la raíz de composición y lo propio de la petición.
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { cargarUiCatalogo, eliminarProducto } from '../ui/catalogo/indexServidor';
import type { ContextoPeticion, RaizComposicion } from './crearRaizComposicion';
import { componerPagina } from './renderizarPagina';

export interface OpcionesServidorSsr {
  raiz: RaizComposicion;
  /** index.html con las marcas <!--ssr-html--> y <!--ssr-datos-->. */
  plantilla: string;
  /** Carpeta del cliente compilado (dist/client). Sin ella, no se sirven estáticos. */
  dirEstaticos?: string;
}

const TIPOS: Record<string, string> = {
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

/** Lo propio de esta petición: el usuario que la hizo y una traza para seguirla. */
function contextoDe(peticion: IncomingMessage): ContextoPeticion {
  const usuario = peticion.headers['x-usuario'];
  const traza = peticion.headers['x-traza'];
  return { usuario: typeof usuario === 'string' ? usuario : undefined, traza: typeof traza === 'string' ? traza : randomUUID() };
}

function responder(respuesta: ServerResponse, estado: number, tipo?: string, cuerpo?: string | Buffer) {
  respuesta.writeHead(estado, tipo ? { 'Content-Type': tipo } : {});
  respuesta.end(cuerpo);
}

const json = (respuesta: ServerResponse, estado: number, cuerpo: unknown) =>
  responder(respuesta, estado, 'application/json; charset=utf-8', JSON.stringify(cuerpo));

/** Un archivo de dist/client, sin salir de esa carpeta. */
async function estatico(dir: string, ruta: string): Promise<Buffer | undefined> {
  const base = resolve(dir);
  const archivo = resolve(join(base, decodeURIComponent(ruta)));
  if (!archivo.startsWith(base + sep) || archivo.endsWith('index.html')) return undefined;
  return readFile(archivo).catch(() => undefined);
}

export function crearServidorSsr({ raiz, plantilla, dirEstaticos }: OpcionesServidorSsr): Server {
  async function atender(peticion: IncomingMessage, respuesta: ServerResponse) {
    const url = new URL(peticion.url ?? '/', 'http://localhost');
    const metodo = peticion.method;

    if (metodo === 'GET' && url.pathname === '/') {
      const datos = await cargarUiCatalogo(raiz.repositorioPara(contextoDe(peticion)), { termino: url.searchParams.get('q') ?? '' });
      return responder(respuesta, 200, 'text/html; charset=utf-8', componerPagina(plantilla, datos));
    }
    if (metodo === 'GET' && url.pathname === '/api/catalogo') {
      return json(respuesta, 200, await cargarUiCatalogo(raiz.repositorioPara(contextoDe(peticion)), { termino: url.searchParams.get('q') ?? '' }));
    }
    const borrar = /^\/api\/productos\/([^/]+)$/.exec(url.pathname);
    if (metodo === 'DELETE' && borrar) {
      const resultado = await eliminarProducto(raiz.repositorioPara(contextoDe(peticion)), decodeURIComponent(borrar[1]));
      return resultado === 'eliminado' ? responder(respuesta, 204) : json(respuesta, 404, { error: 'no-encontrado' });
    }
    if (metodo === 'GET' && dirEstaticos) {
      const contenido = await estatico(dirEstaticos, url.pathname);
      if (contenido) return responder(respuesta, 200, TIPOS[extname(url.pathname)] ?? 'application/octet-stream', contenido);
    }
    return json(respuesta, 404, { error: 'ruta-desconocida' });
  }

  return createServer((peticion, respuesta) => {
    atender(peticion, respuesta).catch((error: unknown) => {
      console.error('SSR: error al atender', peticion.method, peticion.url, error);
      json(respuesta, 502, { error: 'no-disponible' });
    });
  });
}
