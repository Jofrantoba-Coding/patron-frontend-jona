import type { JButtonVariant } from '../JButton';
export type { JButtonVariant };


/** Contrato publico de JIcon (boton solo-icono). El icono se proyecta. */
export interface InterJIcon {
  /** Etiqueta accesible obligatoria (aria-label). */
  label: string;
  variant?: JButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const JICON_DEFAULTS = {
  variant: 'ghost',
  loading: false,
  disabled: false,
  type: 'button',
} as const satisfies Pick<InterJIcon, 'variant' | 'loading' | 'disabled' | 'type'>;
