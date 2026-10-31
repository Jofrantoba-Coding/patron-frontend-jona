// Contrato de UI de la casilla.

export interface InterJCheckbox {
  label: string;
  /** Estado: lo decide quien usa la casilla, nunca los DEFAULTS. */
  checked?: boolean;
  disabled?: boolean;
  /** Valor primero: entrega si la casilla queda marcada. */
  onChange?: (checked: boolean) => void;
  'aria-describedby'?: string;
}

/**
 * Solo configuración. `checked` no va aquí: un valor de estado por defecto
 * convertiría toda casilla en controlada y la fijaría marcada o desmarcada.
 */
export const JCHECKBOX_DEFAULTS = {
  disabled: false,
} as const satisfies Required<Pick<InterJCheckbox, 'disabled'>>;
