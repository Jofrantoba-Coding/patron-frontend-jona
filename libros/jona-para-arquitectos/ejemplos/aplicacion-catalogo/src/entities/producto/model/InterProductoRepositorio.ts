// Puerto (contrato de servicio): lo que la aplicación necesita del almacenamiento de productos.
// Vive en la entidad porque lo usan tres funcionalidades (listar, guardar, eliminar).
import type { DatosProducto, Producto } from './Producto';

/**
 * Los errores llegan como ErrorRepositorio (shared/api):
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
