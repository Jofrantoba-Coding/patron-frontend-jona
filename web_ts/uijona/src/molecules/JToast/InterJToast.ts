// InterJToast.ts — JONA Interface
export type JToastVariant = 'default' | 'success' | 'warning' | 'danger';

export type JToastPosition =
  | 'top-left'    | 'top-center'    | 'top-right'
  | 'center-left' | 'center'        | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export const JTOAST_POSITION_DEFAULT: JToastPosition = 'bottom-right';

export interface InterJToast {
  id:        string;
  message:   string;
  title?:    string;
  variant?:  JToastVariant;
  duration?: number;
  onDismiss?: (id: string) => void;
}

export const JTOAST_DEFAULTS: Required<Pick<InterJToast, 'variant' | 'duration'>> = {
  variant:  'default',
  duration: 4000,
};
