// Dominio: el producto (copia del capítulo 14, recortada a lo que usa esta pantalla). Puro: lo
// pueden importar el servidor y el cliente.

export interface Producto {
  id: string;
  /** Código único del producto: tres letras, guion y tres dígitos (TEC-001). */
  sku: string;
  nombre: string;
  /** Precio en soles, con dos decimales como máximo. */
  precio: number;
  stock: number;
}

/** Un producto sin identificador: lo que se crea o se actualiza. */
export type DatosProducto = Omit<Producto, 'id'>;

/** Si un producto coincide con el término de búsqueda: por nombre o por SKU, sin distinguir mayúsculas. */
export function coincide(producto: Producto, termino: string): boolean {
  const t = termino.trim().toLowerCase();
  return t === '' || producto.nombre.toLowerCase().includes(t) || producto.sku.toLowerCase().includes(t);
}
