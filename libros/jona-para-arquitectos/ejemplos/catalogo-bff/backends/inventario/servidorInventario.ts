// Backend de negocio «inventario» (simulado): dueño de las unidades en existencia de cada SKU.
// No sabe de nombres ni de precios. Sus errores tienen otro formato que los de catalogo.
import { createServer, type Server } from 'node:http';
import { leerJson, responder } from '../http.js';

export interface ExistenciaInventario {
  sku: string;
  unidades: number;
}

const error = (codigo: string, mensaje: string) => ({ codigo, mensaje });

/**
 * GET /existencias?sku=A&sku=B  · PUT|DELETE /existencias/:sku  (PUT crea o reemplaza)
 * POST /__pruebas/reiniciar (solo para pruebas: lo vacía).
 */
export function crearServidorInventario(semilla: readonly ExistenciaInventario[] = []): Server {
  const unidades = new Map(semilla.map((e) => [e.sku, e.unidades]));

  return createServer(async (peticion, respuesta) => {
    const url = new URL(peticion.url ?? '/', 'http://localhost');
    const [, recurso, skuEnRuta] = url.pathname.split('/');
    const metodo = peticion.method;

    if (metodo === 'POST' && url.pathname === '/__pruebas/reiniciar') {
      unidades.clear();
      return responder(respuesta, 204);
    }
    if (recurso !== 'existencias') return responder(respuesta, 404, error('RUTA_DESCONOCIDA', url.pathname));

    if (skuEnRuta === undefined) {
      if (metodo !== 'GET') return responder(respuesta, 405, error('METODO_NO_PERMITIDO', `${metodo}`));
      const existencias = url.searchParams
        .getAll('sku')
        .filter((sku) => unidades.has(sku))
        .map((sku) => ({ sku, unidades: unidades.get(sku) }));
      return responder(respuesta, 200, { existencias });
    }

    const sku = decodeURIComponent(skuEnRuta);
    if (metodo === 'PUT') {
      const cuerpo = (await leerJson(peticion)) as { unidades?: unknown } | undefined;
      const valor = cuerpo?.unidades;
      if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 0) {
        return responder(respuesta, 400, error('UNIDADES_INVALIDAS', 'Las unidades son un entero mayor o igual a cero'));
      }
      unidades.set(sku, valor);
      return responder(respuesta, 200, { sku, unidades: valor });
    }
    if (metodo === 'DELETE') {
      if (!unidades.delete(sku)) return responder(respuesta, 404, error('SIN_EXISTENCIA', `No hay existencias de ${sku}`));
      return responder(respuesta, 204);
    }
    return responder(respuesta, 405, error('METODO_NO_PERMITIDO', `${metodo}`));
  });
}
