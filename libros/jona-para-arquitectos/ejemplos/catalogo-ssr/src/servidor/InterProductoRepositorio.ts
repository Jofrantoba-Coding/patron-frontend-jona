// Puerto (copia del capítulo 14). Vive en servidor/: con SSR, solo el servidor habla con el
// almacenamiento; el navegador habla con el servidor por sus rutas JSON.
import type { DatosProducto, Producto } from '../dominio/Producto';

/**
 * Los errores llegan como ErrorRepositorio:
 * `conflicto` si el SKU ya existe, `no-encontrado` si el id no existe, `red` para lo demás.
 */
export interface InterProductoRepositorio {
  /** Productos que coinciden con el término (por nombre o SKU), ordenados por SKU. */
  listar(termino?: string): Promise<Producto[]>;
  /** undefined si no existe. */
  obtener(id: string): Promise<Producto | undefined>;
  crear(datos: DatosProducto): Promise<Producto>;
  actualizar(id: string, datos: DatosProducto): Promise<Producto>;
  eliminar(id: string): Promise<void>;
}
