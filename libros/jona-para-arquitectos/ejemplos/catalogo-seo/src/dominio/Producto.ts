// El producto del catálogo, con lo que una ficha pública necesita: descripción e imagen.

export interface ImagenProducto {
  /** Ruta del sitio: `/img/productos/TEC-001.svg`. */
  src: string;
  ancho: number;
  alto: number;
  /** Qué muestra la imagen, para quien no la ve. */
  alt: string;
}

export interface Producto {
  sku: string;
  nombre: string;
  descripcion: string;
  /** En soles. */
  precio: number;
  stock: number;
  imagen: ImagenProducto;
}
