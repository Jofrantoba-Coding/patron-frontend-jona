// Contrato de UI del catálogo, con dos caras como en el capítulo 15. La misma unidad dibuja dos
// rutas: el catálogo completo (`/`, se indexa) y los resultados de una búsqueda (`/buscar?q=`, no
// se indexa). La diferencia está en los datos: `termino` existe solo en la búsqueda.

/** Una fila ya formateada por el servidor. */
export interface FilaProductoUi {
  sku: string;
  nombre: string;
  /** «S/ 45.50». */
  precio: string;
  disponible: boolean;
  imagen: { src: string; ancho: number; alto: number; alt: string };
}

/** Cara de datos: serializable (regla 2 de test/architecture). */
export interface DatosUiCatalogo {
  /** Solo en la búsqueda: el término con el que se cargó. Ausente, es el catálogo completo. */
  termino?: string;
  productos: readonly FilaProductoUi[];
  aviso?: string;
}

/** Estado de interacción: no viene del servidor. */
export interface InteraccionUiCatalogo {
  /** Lo que el usuario escribe en el buscador. */
  borrador: string;
  /** Una búsqueda en curso en el navegador (solo en el sitio estático). */
  buscando: boolean;
}

/** Cara de eventos: solo en el cliente. Buscar es enviar el formulario: no necesita evento. */
export interface EventosUiCatalogo {
  onCambiarBorrador: (texto: string) => void;
}

export interface TextosUiCatalogo {
  titulo: string;
  tituloBusqueda: string;
  etiquetaBuscar: string;
  textoBuscar: string;
  textoVacio: string;
  textoSinTermino: string;
  textoBuscando: string;
}

export interface InterUiCatalogo extends DatosUiCatalogo, InteraccionUiCatalogo, EventosUiCatalogo, TextosUiCatalogo {}

export const UICATALOGO_DEFAULTS = {
  titulo: 'Catálogo de productos',
  tituloBusqueda: 'Buscar productos',
  etiquetaBuscar: 'Buscar en el catálogo',
  textoBuscar: 'Buscar',
  textoVacio: 'Ningún producto coincide con la búsqueda',
  textoSinTermino: 'Escriba el nombre o el SKU de un producto',
  textoBuscando: 'Buscando…',
} as const satisfies TextosUiCatalogo;
