// Contrato de UI. Usa tipos de React: portable en intención, no en código.
import type { MouseEvent, ReactNode } from 'react';

export interface InterJButton {
  children?: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  /** Excepción de bajo nivel: entrega el evento del navegador. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** Solo configuración de presentación; nunca estado. */
export const JBUTTON_DEFAULTS = {
  variant: 'default',
  size: 'md',
  iconPosition: 'left',
  loading: false,
  fullWidth: false,
  type: 'button',
} as const satisfies Required<Pick<InterJButton,
  'variant' | 'size' | 'iconPosition' | 'loading' | 'fullWidth' | 'type'>>;
