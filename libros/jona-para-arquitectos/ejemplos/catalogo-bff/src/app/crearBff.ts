// Raíz de composición del BFF: el único lugar que elige adaptadores (regla 2 de test/architecture).
// Las direcciones de los backends llegan del entorno.
import type { Server } from 'node:http';
import { crearCatalogoHttp } from '../adaptadores/crearCatalogoHttp.js';
import { crearInventarioHttp } from '../adaptadores/crearInventarioHttp.js';
import { crearServidorBff } from '../http/crearServidorBff.js';
import { crearManejadoresProductos } from '../manejadores/crearManejadoresProductos.js';

export interface EntornoBff {
  CATALOGO_URL?: string;
  INVENTARIO_URL?: string;
  /** Origen del navegador que puede llamar al BFF. Sin valor, `*` (desarrollo); con la SPA en el mismo origen, no se usa. */
  BFF_CORS_ORIGEN?: string;
}

export const URLS_POR_DEFECTO = { catalogo: 'http://127.0.0.1:4021', inventario: 'http://127.0.0.1:4022' } as const;

export function crearBff(entorno: EntornoBff): Server {
  const catalogo = crearCatalogoHttp({ baseUrl: entorno.CATALOGO_URL ?? URLS_POR_DEFECTO.catalogo });
  const inventario = crearInventarioHttp({ baseUrl: entorno.INVENTARIO_URL ?? URLS_POR_DEFECTO.inventario });
  return crearServidorBff(crearManejadoresProductos({ catalogo, inventario }), { origenPermitido: entorno.BFF_CORS_ORIGEN ?? '*' });
}
