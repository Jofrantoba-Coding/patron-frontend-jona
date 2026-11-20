// Contrato de UI del catálogo, con dos caras. La de datos es serializable: la llena la
// Implementación del servidor y viaja dentro del HTML. La de eventos son funciones: solo existe
// en el cliente. Entre las dos, el estado de interacción, que lleva la Implementación del cliente.

/** Una fila ya formateada por el servidor: la vista no formatea importes. */
export interface FilaProductoUi {
  id: string;
  sku: string;
  nombre: string;
  /** «S/ 45.50». */
  precio: string;
  stock: number;
}

/** Cara de datos. Solo valores que sobreviven a JSON: ni funciones ni instancias (regla 2 de test/architecture). */
export interface DatosUiCatalogo {
  /** El término con el que se cargó la lista. */
  termino: string;
  productos: readonly FilaProductoUi[];
  /** Si el servidor no pudo cargar el catálogo. */
  aviso?: string;
}

/** Estado de interacción: no viene del servidor ni viaja en el HTML. */
export interface InteraccionUiCatalogo {
  /** Lo que el usuario escribe en el buscador, antes de buscar. */
  borrador: string;
  /** Una búsqueda o un borrado en curso. */
  pendiente: boolean;
  /** El producto que se pidió eliminar; undefined, el diálogo está cerrado. */
  aEliminar?: FilaProductoUi;
  error?: string;
}

/** Cara de eventos: solo existe en el cliente. */
export interface EventosUiCatalogo {
  onCambiarBorrador: (texto: string) => void;
  onBuscar: () => void;
  onPedirEliminar: (fila: FilaProductoUi) => void;
  onConfirmarEliminar: () => void;
  onCancelarEliminar: () => void;
}

/** Configuración de presentación. */
export interface TextosUiCatalogo {
  titulo: string;
  etiquetaBuscar: string;
  textoBuscar: string;
  textoVacio: string;
  textoMensajeEliminar: string;
  textoConfirmarEliminar: string;
}

export interface InterUiCatalogo extends DatosUiCatalogo, InteraccionUiCatalogo, EventosUiCatalogo, TextosUiCatalogo {}

/** Solo textos: los datos, la interacción y los eventos no tienen default. */
export const UICATALOGO_DEFAULTS = {
  titulo: 'Productos',
  etiquetaBuscar: 'Buscar productos',
  textoBuscar: 'Buscar',
  textoVacio: 'No hay productos que coincidan',
  textoMensajeEliminar: 'El producto sale del catálogo. No se puede deshacer.',
  textoConfirmarEliminar: 'Eliminar',
} as const satisfies TextosUiCatalogo;
