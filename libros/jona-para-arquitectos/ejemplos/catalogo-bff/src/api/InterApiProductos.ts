// La API que sirve el BFF: exactamente la que espera el adaptador HTTP del capítulo 14
// (aplicacion-catalogo/src/entities/producto/api/crearRepositorioHttp.ts). Es copia de sus tipos,
// no una importación: los ejemplos son independientes.

export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  /** Precio en soles, con dos decimales como máximo. */
  precio: number;
  stock: number;
}

export type DatosProducto = Omit<Producto, 'id'>;

/**
 * Lo que el BFF ofrece a la SPA: la misma forma que el puerto InterProductoRepositorio del
 * capítulo 14, ahora del otro lado de HTTP. Los errores llegan como ErrorBackend.
 */
export interface InterApiProductos {
  listar(termino?: string): Promise<Producto[]>;
  /** undefined si no existe. */
  obtener(id: string): Promise<Producto | undefined>;
  crear(datos: DatosProducto): Promise<Producto>;
  actualizar(id: string, datos: DatosProducto): Promise<Producto>;
  eliminar(id: string): Promise<void>;
}
