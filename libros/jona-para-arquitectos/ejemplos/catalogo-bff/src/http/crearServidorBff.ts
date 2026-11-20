// Capa HTTP del BFF: la API REST de productos del capítulo 14 sobre node:http. Lleva cada ruta a
// un manejador y cada ErrorBackend a un código que el adaptador de la SPA entiende. No conoce
// los backends: recibe los manejadores ya armados.
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { DatosProducto, InterApiProductos } from '../api/InterApiProductos.js';
import { ErrorBackend, type TipoErrorBackend } from '../puertos/ErrorBackend.js';

export interface OpcionesServidorBff {
  /** Origen que puede llamar desde el navegador. Solo hace falta si la SPA se sirve desde otro origen. */
  origenPermitido?: string;
}

/** El adaptador HTTP de la SPA traduce 404 a no-encontrado, 409 a conflicto y lo demás a red. */
const ESTADO_DE: Record<TipoErrorBackend, number> = { 'no-encontrado': 404, conflicto: 409, 'no-disponible': 502 };

class CuerpoInvalido extends Error {}

async function leerDatos(peticion: IncomingMessage): Promise<DatosProducto> {
  let texto = '';
  for await (const parte of peticion) texto += parte;
  try {
    return JSON.parse(texto) as DatosProducto;
  } catch {
    throw new CuerpoInvalido();
  }
}

export function crearServidorBff(api: InterApiProductos, { origenPermitido }: OpcionesServidorBff = {}): Server {
  const cors: Record<string, string> = origenPermitido
    ? {
        'Access-Control-Allow-Origin': origenPermitido,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      }
    : {};

  function responder(respuesta: ServerResponse, estado: number, cuerpo?: unknown) {
    respuesta.writeHead(estado, { ...cors, ...(cuerpo === undefined ? {} : { 'Content-Type': 'application/json' }) });
    respuesta.end(cuerpo === undefined ? undefined : JSON.stringify(cuerpo));
  }

  async function atender(peticion: IncomingMessage, respuesta: ServerResponse) {
    const url = new URL(peticion.url ?? '/', 'http://localhost');
    const [, recurso, idEnRuta, sobra] = url.pathname.split('/');
    const metodo = peticion.method;

    if (metodo === 'OPTIONS') return responder(respuesta, 204);
    if (recurso !== 'productos' || sobra !== undefined) return responder(respuesta, 404, { error: 'ruta-desconocida' });

    if (idEnRuta === undefined) {
      if (metodo === 'GET') return responder(respuesta, 200, await api.listar(url.searchParams.get('q') ?? ''));
      if (metodo === 'POST') return responder(respuesta, 201, await api.crear(await leerDatos(peticion)));
      return responder(respuesta, 405, { error: 'metodo-no-permitido' });
    }

    const id = decodeURIComponent(idEnRuta);
    if (metodo === 'GET') {
      const producto = await api.obtener(id);
      return producto ? responder(respuesta, 200, producto) : responder(respuesta, 404, { error: 'no-encontrado' });
    }
    if (metodo === 'PUT') return responder(respuesta, 200, await api.actualizar(id, await leerDatos(peticion)));
    if (metodo === 'DELETE') {
      await api.eliminar(id);
      return responder(respuesta, 204);
    }
    return responder(respuesta, 405, { error: 'metodo-no-permitido' });
  }

  return createServer((peticion, respuesta) => {
    atender(peticion, respuesta).catch((error: unknown) => {
      if (error instanceof ErrorBackend) return responder(respuesta, ESTADO_DE[error.tipo], { error: error.tipo, mensaje: error.message });
      if (error instanceof CuerpoInvalido) return responder(respuesta, 400, { error: 'cuerpo-invalido' });
      console.error('BFF: error inesperado', error);
      return responder(respuesta, 500, { error: 'interno' });
    });
  });
}
