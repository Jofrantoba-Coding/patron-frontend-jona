// Contrato de UI del catálogo. Dos tipos cierran la puerta a estados inseguros: el enlace es una
// UrlSegura, que solo produce aUrlSegura, y los permisos son datos que la pantalla recibe.
import type { UrlSegura } from '../../compartido/UrlSegura';

/** Una fila ya preparada por la Implementación. Los textos son texto: la vista no los interpreta. */
export interface FilaProductoUi {
  id: string;
  sku: string;
  nombre: string;
  /** «S/ 45.50». */
  precio: string;
  descripcion: string;
  /** Solo una URL http o https validada. Un texto cualquiera no compila aquí. */
  enlace?: UrlSegura;
}

/** Lo que el servidor permite a quien mira la pantalla. La UI no lo calcula ni lo hace cumplir. */
export interface PermisosUi {
  eliminar: boolean;
}

export interface DatosUiCatalogo {
  usuario: string;
  permisos: PermisosUi;
  productos: readonly FilaProductoUi[];
  cargando: boolean;
  /** Un borrado en curso. */
  pendiente: boolean;
  /** El producto que se pidió eliminar; undefined, el diálogo está cerrado. */
  aEliminar?: FilaProductoUi;
  /** Qué salió mal, como dato; el texto lo pone la configuración. */
  error?: 'carga' | 'prohibido' | 'eliminar';
}

export interface EventosUiCatalogo {
  onPedirEliminar: (fila: FilaProductoUi) => void;
  onConfirmarEliminar: () => void;
  onCancelarEliminar: () => void;
  onSalir: () => void;
}

export interface TextosUiCatalogo {
  titulo: string;
  textoSesion: string;
  textoSalir: string;
  textoVacio: string;
  textoFabricante: string;
  textoMensajeEliminar: string;
  textoConfirmarEliminar: string;
  textoErrorCarga: string;
  textoErrorProhibido: string;
  textoErrorEliminar: string;
}

export interface InterUiCatalogo extends DatosUiCatalogo, EventosUiCatalogo, TextosUiCatalogo {}

/** Solo textos: ni datos, ni permisos, ni credenciales (regla 5). */
export const UICATALOGO_DEFAULTS = {
  titulo: 'Productos',
  textoSesion: 'Sesión de',
  textoSalir: 'Salir',
  textoVacio: 'No hay productos',
  textoFabricante: 'Sitio del fabricante',
  textoMensajeEliminar: 'El producto sale del catálogo. No se puede deshacer.',
  textoConfirmarEliminar: 'Eliminar',
  textoErrorCarga: 'No se pudo cargar el catálogo.',
  textoErrorProhibido: 'No tiene permiso para eliminar productos.',
  textoErrorEliminar: 'No se pudo eliminar. Intente de nuevo.',
} as const satisfies TextosUiCatalogo;
