// Contrato de UI de la confirmación de borrado (modelo de vista).
import type { Producto } from '../../../entities/producto';

export interface InterUiEliminarProducto {
  /** El producto a eliminar; undefined, el diálogo está cerrado. */
  producto?: Producto;
  ocupado: boolean;
  error?: string;
  textoMensaje: string;
  textoConfirmar: string;
  onConfirmar: () => void;
  onCerrar: () => void;
}

/** Solo textos; el producto y el error son estado. */
export const UIELIMINARPRODUCTO_DEFAULTS = {
  textoMensaje: 'El producto sale del catálogo. No se puede deshacer.',
  textoConfirmar: 'Eliminar',
} as const satisfies Pick<InterUiEliminarProducto, 'textoMensaje' | 'textoConfirmar'>;
