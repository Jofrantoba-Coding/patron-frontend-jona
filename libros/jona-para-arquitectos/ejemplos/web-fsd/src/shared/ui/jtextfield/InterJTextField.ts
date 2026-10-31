/** Contrato de UI de un campo de texto. Sin contrato de servicio: es un átomo del sistema de diseño. */
export interface InterJTextField {
  /** Nombre accesible del campo. */
  label: string;
  value: string;
  type?: 'text' | 'email' | 'password';
  disabled?: boolean;
  /** Recibe el valor, no el evento del DOM. */
  onChange?: (value: string) => void;
}

/** Solo configuración de presentación; el valor es estado y no tiene default. */
export const JTEXTFIELD_DEFAULTS = {
  type: 'text',
  disabled: false,
} as const satisfies Required<Pick<InterJTextField, 'type' | 'disabled'>>;
