export type JToastVariant = 'default' | 'success' | 'warning' | 'danger';

export type JToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export const JTOAST_POSITION_DEFAULT: JToastPosition = 'bottom-right';

/** Contrato publico de JToast (unidad visual de notificación). */
export interface InterJToast {
  id: string;
  message: string;
  title?: string;
  variant?: JToastVariant;
  duration?: number;
}
