// Puerto de lectura del catálogo: lo que necesitan las páginas públicas. Las páginas no escriben.
import type { Producto } from '../dominio/Producto';

export interface InterProductoRepositorio {
  /** Ordenados por SKU. Con término, solo los que coinciden (compartido/busqueda.ts). */
  listar(termino?: string): Promise<Producto[]>;
  /** El producto con ese SKU exacto, o undefined. */
  obtenerPorSku(sku: string): Promise<Producto | undefined>;
}
