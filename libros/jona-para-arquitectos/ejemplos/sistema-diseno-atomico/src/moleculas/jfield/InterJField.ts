// Contrato de UI del campo con etiqueta: una molécula. Su vocabulario es propio:
// no extiende InterJInput, aunque la vista use el átomo JInput.

export interface InterJField {
  label: string;
  /** Estado: lo decide quien usa el campo, nunca los DEFAULTS. */
  value: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'number';
  /** Texto de ayuda, siempre visible. */
  hint?: string;
  /** Mensaje de error; si existe, el campo queda marcado como inválido. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Lo que dibuja la vista: el contrato más los identificadores que asocian etiqueta, ayuda y error. */
export interface InterJFieldVista extends InterJField {
  inputId: string;
  hintId?: string;
  errorId?: string;
}

/** Solo configuración de presentación. */
export const JFIELD_DEFAULTS = {
  type: 'text',
  required: false,
  disabled: false,
} as const satisfies Required<Pick<InterJField, 'type' | 'required' | 'disabled'>>;
