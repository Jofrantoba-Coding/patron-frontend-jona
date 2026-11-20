// Contrato de UI del campo de entrada: un átomo, sin etiqueta propia (la pone la molécula JField).

export interface InterJInput {
  /** Estado: lo decide quien usa el campo, nunca los DEFAULTS. */
  value: string;
  /** Valor primero: entrega el texto, no el evento del DOM. */
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'number' | 'search';
  id?: string;
  /** Nombre del campo en el formulario: con él, un formulario GET funciona sin JavaScript. */
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Marca el campo como inválido para las tecnologías de asistencia. */
  invalid?: boolean;
  /** Identificadores de los textos que describen el campo (ayuda, error). */
  describedBy?: string;
  /** Nombre accesible cuando no hay un <label> asociado. */
  'aria-label'?: string;
}

/** Solo configuración de presentación; `value` es estado y no tiene default. */
export const JINPUT_DEFAULTS = {
  type: 'text',
  disabled: false,
  required: false,
} as const satisfies Required<Pick<InterJInput, 'type' | 'disabled' | 'required'>>;
