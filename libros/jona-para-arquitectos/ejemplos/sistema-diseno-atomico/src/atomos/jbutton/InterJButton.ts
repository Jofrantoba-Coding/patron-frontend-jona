// Contrato de UI del botón: un átomo. Sin contrato de servicio y sin estado.
import type { ReactNode } from 'react';

export interface InterJButton {
  /** Texto visible: es el nombre accesible, salvo que aria-label lo precise. */
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Identificador: lo usan los organismos que mueven el foco a un botón concreto. */
  id?: string;
  onClick?: () => void;
  /** Nombre accesible más preciso que el texto: «Editar Teclado» para un botón «Editar». */
  'aria-label'?: string;
}

/** Solo configuración de presentación; nunca estado. */
export const JBUTTON_DEFAULTS = {
  variant: 'primary',
  type: 'button',
} as const satisfies Required<Pick<InterJButton, 'variant' | 'type'>>;
