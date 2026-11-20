// Contrato de UI de la ficha de producto. La cara de datos es lo que un rastreador necesita ver en
// el HTML: nombre, imagen, precio, disponibilidad y descripción. La interacción (el carrito) es del
// cliente, y no cambia lo que el servidor dibuja.

/** Cara de datos: serializable (regla 2 de test/architecture). */
export interface DatosUiProducto {
  sku: string;
  nombre: string;
  descripcion: string;
  /** En soles: el JSON-LD lo publica como número. */
  precio: number;
  /** «S/ 120.00»: lo que se dibuja. */
  precioTexto: string;
  stock: number;
  imagen: { src: string; ancho: number; alto: number; alt: string };
}

export interface InteraccionUiProducto {
  /** Unidades agregadas al carrito en esta visita. */
  enCarrito: number;
}

export interface EventosUiProducto {
  onAgregar: () => void;
}

export interface TextosUiProducto {
  textoAgregar: string;
  textoAgotado: string;
  tituloDetalles: string;
  textoVolver: string;
}

export interface InterUiProducto extends DatosUiProducto, InteraccionUiProducto, EventosUiProducto, TextosUiProducto {}

export const UIPRODUCTO_DEFAULTS = {
  textoAgregar: 'Agregar al carrito',
  textoAgotado: 'Agotado',
  tituloDetalles: 'Detalles',
  textoVolver: 'Volver al catálogo',
} as const satisfies TextosUiProducto;
