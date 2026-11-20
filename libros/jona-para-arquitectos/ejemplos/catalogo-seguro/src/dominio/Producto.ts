/** El producto como lo guarda el backend. Sus textos son datos: pueden traer cualquier cosa. */
export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
  descripcion: string;
  /** La página del fabricante, tal como se guardó: todavía no se sabe si es una URL segura. */
  enlaceFabricante?: string;
}
