// Contrato de UI del formulario de producto (modelo de vista).
import type { BorradorProducto, CampoProducto, ErroresProducto } from '../../../entities/producto';

export interface InterUiFormularioProducto {
  borrador: BorradorProducto;
  errores: ErroresProducto;
  /** Mientras se cargan los datos del producto que se edita. */
  cargando: boolean;
  guardando: boolean;
  /** Un error que no pertenece a ningún campo: sin conexión, producto inexistente. */
  errorGeneral?: string;
  textoGuardar: string;
  textoCancelar: string;
  /** Valor primero: el campo y el texto nuevo. */
  onCambiar: (campo: CampoProducto, valor: string) => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

/** Solo textos; el borrador y los errores son estado. */
export const UIFORMULARIOPRODUCTO_DEFAULTS = {
  textoGuardar: 'Guardar',
  textoCancelar: 'Cancelar',
} as const satisfies Pick<InterUiFormularioProducto, 'textoGuardar' | 'textoCancelar'>;
