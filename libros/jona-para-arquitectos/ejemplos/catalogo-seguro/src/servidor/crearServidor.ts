// El BFF sobre node:http. Entrega el documento con su nonce, los archivos de dist/client y la API
// JSON de la pantalla. Cada decisión de seguridad tiene un solo lugar: la defensa CSRF antes de
// toda ruta de /api, la sesión en la cookie, la autorización en cada acción.
import { readFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { CABECERAS_API, CABECERAS_ESTATICOS, cabecerasDocumento, generarNonce } from './cabeceras';
import { componerDocumento } from './documento';
import { puede, sesionPublica } from './permisos';
import { revisarOrigen } from './proteccionCsrf';
import type { RaizComposicion } from './crearRaizComposicion';

export interface OpcionesServidor {
  raiz: RaizComposicion;
  /** index.html compilado, con la marca del nonce. */
  plantilla: string;
  /** Carpeta del cliente compilado (dist/client). Sin ella, no se sirven estáticos. */
  dirEstaticos?: string;
}

/**
 * __Host-: el navegador la acepta solo con Secure, Path=/ y sin Domain, así que ningún subdominio
 * puede pisarla. HttpOnly: JavaScript no la lee. SameSite=Strict: no viaja desde otro sitio.
 */
const NOMBRE_COOKIE = '__Host-sesion';
const ATRIBUTOS_COOKIE = 'Path=/; Secure; HttpOnly; SameSite=Strict';
const LIMITE_CUERPO = 4096;

const TIPOS: Record<string, string> = {
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function json(respuesta: ServerResponse, estado: number, cuerpo?: unknown, cabeceras: Record<string, string> = {}) {
  respuesta.writeHead(estado, { ...CABECERAS_API, ...cabeceras });
  respuesta.end(cuerpo === undefined ? undefined : JSON.stringify(cuerpo));
}

function cookieDeSesion(peticion: IncomingMessage): string | undefined {
  const par = (peticion.headers.cookie ?? '').split(/;\s*/).find((c) => c.startsWith(`${NOMBRE_COOKIE}=`));
  return par?.slice(NOMBRE_COOKIE.length + 1) || undefined;
}

class CuerpoInvalido extends Error {
  constructor(readonly estado: 400 | 413) {
    super(`cuerpo inválido (${estado})`);
  }
}

/** Lee {email, clave} sin confiar en nada: tamaño, JSON y tipos. */
async function leerCredenciales(peticion: IncomingMessage): Promise<{ email: string; clave: string }> {
  let total = 0;
  const partes: Buffer[] = [];
  for await (const parte of peticion as AsyncIterable<Buffer>) {
    total += parte.length;
    if (total <= LIMITE_CUERPO) partes.push(parte);
  }
  if (total > LIMITE_CUERPO) throw new CuerpoInvalido(413);
  let datos: unknown;
  try {
    datos = JSON.parse(Buffer.concat(partes).toString('utf8'));
  } catch {
    throw new CuerpoInvalido(400);
  }
  const { email, clave } = (datos ?? {}) as Record<string, unknown>;
  if (typeof email !== 'string' || typeof clave !== 'string') throw new CuerpoInvalido(400);
  return { email, clave };
}

/** Un archivo de dist/client, sin salir de esa carpeta. index.html no: lleva nonce y lo compone el BFF. */
async function estatico(dir: string, ruta: string): Promise<Buffer | undefined> {
  const base = resolve(dir);
  const archivo = resolve(join(base, decodeURIComponent(ruta)));
  if (!archivo.startsWith(base + sep) || archivo.endsWith('index.html')) return undefined;
  return readFile(archivo).catch(() => undefined);
}

export function crearServidor({ raiz, plantilla, dirEstaticos }: OpcionesServidor): Server {
  async function api(peticion: IncomingMessage, respuesta: ServerResponse, ruta: string) {
    const veredicto = revisarOrigen(peticion.headers, raiz.origen);
    if (!veredicto.permitida) return json(respuesta, 403, { error: 'origen', motivo: veredicto.motivo });

    const metodo = peticion.method;
    const id = cookieDeSesion(peticion);

    if (ruta === '/api/sesion' && metodo === 'POST') {
      const { email, clave } = await leerCredenciales(peticion);
      const usuario = await raiz.usuarios.verificar(email, clave);
      // Un solo mensaje para correo desconocido y contraseña incorrecta.
      if (!usuario) return json(respuesta, 401, { error: 'credenciales' });
      // Identificador nuevo en cada inicio de sesión; el anterior, si había, deja de valer.
      raiz.sesiones.destruir(id);
      const nuevo = raiz.sesiones.crear(usuario);
      return json(respuesta, 200, sesionPublica(usuario), { 'Set-Cookie': `${NOMBRE_COOKIE}=${nuevo}; ${ATRIBUTOS_COOKIE}` });
    }

    const usuario = raiz.sesiones.leer(id);
    if (ruta === '/api/sesion' && metodo === 'DELETE') {
      raiz.sesiones.destruir(id);
      return json(respuesta, 204, undefined, { 'Set-Cookie': `${NOMBRE_COOKIE}=; ${ATRIBUTOS_COOKIE}; Max-Age=0` });
    }
    if (!usuario) return json(respuesta, 401, { error: 'sin-sesion' });

    if (ruta === '/api/sesion' && metodo === 'GET') return json(respuesta, 200, sesionPublica(usuario));
    if (ruta === '/api/productos' && metodo === 'GET') {
      if (!puede(usuario.rol, 'listar')) return json(respuesta, 403, { error: 'prohibido' });
      return json(respuesta, 200, await raiz.productos.listar());
    }
    const borrar = /^\/api\/productos\/([^/]+)$/.exec(ruta);
    if (borrar && metodo === 'DELETE') {
      // La UI de un lector no muestra el botón, pero eso no es un control: este sí.
      if (!puede(usuario.rol, 'eliminar')) return json(respuesta, 403, { error: 'prohibido' });
      return (await raiz.productos.eliminar(decodeURIComponent(borrar[1]))) ? json(respuesta, 204) : json(respuesta, 404, { error: 'no-encontrado' });
    }
    return json(respuesta, 404, { error: 'ruta-desconocida' });
  }

  async function atender(peticion: IncomingMessage, respuesta: ServerResponse) {
    const { pathname } = new URL(peticion.url ?? '/', 'http://localhost');
    if (pathname.startsWith('/api/')) return api(peticion, respuesta, pathname);
    if (peticion.method === 'GET' && pathname === '/') {
      const nonce = generarNonce();
      respuesta.writeHead(200, cabecerasDocumento(nonce));
      return respuesta.end(componerDocumento(plantilla, nonce));
    }
    if (peticion.method === 'GET' && dirEstaticos) {
      const contenido = await estatico(dirEstaticos, pathname);
      if (contenido) {
        respuesta.writeHead(200, { ...CABECERAS_ESTATICOS, 'Content-Type': TIPOS[extname(pathname)] ?? 'application/octet-stream' });
        return respuesta.end(contenido);
      }
    }
    return json(respuesta, 404, { error: 'ruta-desconocida' });
  }

  return createServer((peticion, respuesta) => {
    atender(peticion, respuesta).catch((error: unknown) => {
      if (error instanceof CuerpoInvalido) return json(respuesta, error.estado, { error: 'cuerpo-invalido' });
      // El detalle se queda en el registro del servidor; el navegador recibe solo que falló.
      console.error('BFF: error al atender', peticion.method, peticion.url, error);
      json(respuesta, 500, { error: 'interno' });
    });
  });
}
