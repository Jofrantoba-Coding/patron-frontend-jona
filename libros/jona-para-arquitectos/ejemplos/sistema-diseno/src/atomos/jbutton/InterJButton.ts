// Contrato de UI del botón. Los atributos ARIA son parte del contrato, con tipo.
import type { ReactNode } from 'react';

export interface InterJButtonBase {
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  'aria-describedby'?: string;
  'aria-pressed'?: boolean;
}

/** Con texto visible: el texto es el nombre accesible. */
export interface InterJButtonConTexto extends InterJButtonBase {
  children: ReactNode;
  icon?: ReactNode;
  'aria-label'?: string;
}

/** Solo icono: sin texto visible, el nombre accesible es obligatorio. */
export interface InterJButtonSoloIcono extends InterJButtonBase {
  children?: never;
  icon: ReactNode;
  'aria-label': string;
}

export type InterJButton = InterJButtonConTexto | InterJButtonSoloIcono;

/** Solo configuración de presentación; nunca estado. */
export const JBUTTON_DEFAULTS = {
  variant: 'primary',
  type: 'button',
} as const satisfies Required<Pick<InterJButtonBase, 'variant' | 'type'>>;
