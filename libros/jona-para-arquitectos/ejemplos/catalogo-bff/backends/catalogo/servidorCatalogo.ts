// Backend de negocio «catalogo» (simulado): dueño del SKU, el título y el precio. Aquí vive la regla
// de unicidad del SKU, y aquí se responde el conflicto, en el formato propio de este servicio.
// Su contrato difiere a propósito del de la API de productos: el BFF es quien traduce.
import { createServer, type Server } from 'node:http';
import { leerJson, responder } from '../http.js';

export interface ArticuloCatalogo {
  codigoArticulo: string;
  sku: string;
  titulo: string;
  /** Entero: este servicio guarda los importes en céntimos. */
  precioCentimos: number;
}

export type DatosArticuloCatalogo = Omit<ArticuloCatalogo, 'codigoArticulo'>;

const falla = (tipo: string, detalle: string) => ({ falla: { tipo, detalle } });

function datosDe(cuerpo: unknown): DatosArticuloCatalogo | undefined {
  const c = cuerpo as Partial<DatosArticuloCatalogo> | undefined;
  if (typeof c?.sku !== 'string' || typeof c.titulo !== 'string' || !Number.isInteger(c.precioCentimos)) return undefined;
  return { sku: c.sku, titulo: c.titulo, precioCentimos: c.precioCentimos as number };
}

/**
 * GET /articulos?texto=  · GET|PUT|DELETE /articulos/:codigo  · POST /articulos
 * POST /__pruebas/reiniciar (solo para pruebas: lo vacía).
 */
export function crearServidorCatalogo(semilla: readonly DatosArticuloCatalogo[] = []): Server {
  const articulos = new Map<string, ArticuloCatalogo>();
  let siguiente = 1;
  const alta = (datos: DatosArticuloCatalogo) => {
    const articulo = { codigoArticulo: `ART-${String(siguiente++).padStart(4, '0')}`, ...datos };
    articulos.set(articulo.codigoArticulo, articulo);
    return articulo;
  };
  semilla.forEach(alta);

  // La regla de negocio que el BFF no repite.
  const skuOcupado = (sku: string, salvo?: string) => [...articulos.values()].some((a) => a.sku === sku && a.codigoArticulo !== salvo);
  const duplicado = (sku: string) => falla('SKU_DUPLICADO', `El SKU ${sku} ya está registrado`);

  return createServer(async (peticion, respuesta) => {
    const url = new URL(peticion.url ?? '/', 'http://localhost');
    const [, recurso, codigo] = url.pathname.split('/');
    const metodo = peticion.method;

    if (metodo === 'POST' && url.pathname === '/__pruebas/reiniciar') {
      articulos.clear();
      return responder(respuesta, 204);
    }
    if (recurso !== 'articulos') return responder(respuesta, 404, falla('RUTA_DESCONOCIDA', url.pathname));

    if (codigo === undefined) {
      if (metodo === 'GET') {
        const texto = (url.searchParams.get('texto') ?? '').toLowerCase();
        const datos = [...articulos.values()]
          .filter((a) => a.titulo.toLowerCase().includes(texto) || a.sku.toLowerCase().includes(texto))
          .sort((a, b) => a.sku.localeCompare(b.sku));
        return responder(respuesta, 200, { datos, total: datos.length });
      }
      if (metodo === 'POST') {
        const datos = datosDe(await leerJson(peticion));
        if (!datos) return responder(respuesta, 400, falla('CUERPO_INVALIDO', 'Se esperan sku, titulo y precioCentimos'));
        if (skuOcupado(datos.sku)) return responder(respuesta, 422, duplicado(datos.sku));
        return responder(respuesta, 201, alta(datos));
      }
      return responder(respuesta, 405, falla('METODO_NO_PERMITIDO', `${metodo}`));
    }

    const existente = articulos.get(decodeURIComponent(codigo));
    if (!existente) return responder(respuesta, 404, falla('ARTICULO_INEXISTENTE', `No existe el artículo ${codigo}`));
    if (metodo === 'GET') return responder(respuesta, 200, existente);
    if (metodo === 'PUT') {
      const datos = datosDe(await leerJson(peticion));
      if (!datos) return responder(respuesta, 400, falla('CUERPO_INVALIDO', 'Se esperan sku, titulo y precioCentimos'));
      if (skuOcupado(datos.sku, existente.codigoArticulo)) return responder(respuesta, 422, duplicado(datos.sku));
      const articulo = { codigoArticulo: existente.codigoArticulo, ...datos };
      articulos.set(articulo.codigoArticulo, articulo);
      return responder(respuesta, 200, articulo);
    }
    if (metodo === 'DELETE') {
      articulos.delete(existente.codigoArticulo);
      return responder(respuesta, 200, { eliminado: existente.codigoArticulo });
    }
    return responder(respuesta, 405, falla('METODO_NO_PERMITIDO', `${metodo}`));
  });
}
