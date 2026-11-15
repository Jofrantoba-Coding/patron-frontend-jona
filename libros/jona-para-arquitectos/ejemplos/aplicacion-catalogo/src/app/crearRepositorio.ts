import { crearRepositorioHttp, crearRepositorioMemoria, type InterProductoRepositorio, type Producto } from '../entities/producto';

export interface EntornoRepositorio {
  /** `http` usa la API REST; cualquier otro valor, el adaptador en memoria con datos de ejemplo. */
  VITE_REPOSITORIO?: string;
  VITE_API_URL?: string;
}

export const PRODUCTOS_DE_EJEMPLO: readonly Producto[] = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 },
  { id: 'p-3', sku: 'MON-003', nombre: 'Monitor de 24 pulgadas', precio: 699, stock: 3 },
];

/** Raíz de composición: el único lugar de la aplicación que elige un adaptador del puerto. */
export function crearRepositorio(entorno: EntornoRepositorio): InterProductoRepositorio {
  if (entorno.VITE_REPOSITORIO === 'http') {
    return crearRepositorioHttp({ baseUrl: entorno.VITE_API_URL ?? 'http://127.0.0.1:4020' });
  }
  return crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO);
}
