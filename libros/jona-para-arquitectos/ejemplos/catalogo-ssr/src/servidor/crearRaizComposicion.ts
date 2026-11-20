// Raíz de composición del servidor. En el navegador hay un usuario por proceso; en el servidor,
// muchas peticiones a la vez en el mismo proceso. Por eso este módulo exporta una fábrica y no
// una instancia (regla 4 de test/architecture): la raíz se arma una vez con el entorno, y el
// repositorio se crea en cada petición con lo propio de esa petición.
import type { Producto } from '../dominio/Producto';
import { crearRepositorioHttp } from './adaptadores/crearRepositorioHttp';
import { crearRepositorioMemoria } from './adaptadores/crearRepositorioMemoria';
import type { InterProductoRepositorio } from './InterProductoRepositorio';

/** Variables del servidor, no VITE_*: no se compilan en el cliente. */
export interface EntornoServidor {
  /** `http` usa la API REST de API_URL; cualquier otro valor, el adaptador en memoria. */
  REPOSITORIO?: string;
  API_URL?: string;
}

/** Lo propio de una petición. */
export interface ContextoPeticion {
  usuario?: string;
  traza: string;
}

export interface RaizComposicion {
  repositorioPara(contexto: ContextoPeticion): InterProductoRepositorio;
}

export const PRODUCTOS_DE_EJEMPLO: readonly Producto[] = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 },
  { id: 'p-3', sku: 'MON-003', nombre: 'Monitor de 24 pulgadas', precio: 699, stock: 3 },
];

export function crearRaizComposicion(entorno: EntornoServidor): RaizComposicion {
  if (entorno.REPOSITORIO === 'http') {
    const baseUrl = entorno.API_URL ?? 'http://127.0.0.1:4020';
    return {
      repositorioPara: ({ usuario, traza }) => crearRepositorioHttp({ baseUrl, cabeceras: { 'X-Usuario': usuario, 'X-Traza': traza } }),
    };
  }
  // En memoria, el almacén es del proceso: hace de base de datos, así que lo comparten las
  // peticiones. Lo crea la fábrica, no el módulo: cada prueba y cada proceso tienen el suyo.
  const almacen = crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO);
  return { repositorioPara: () => almacen };
}
