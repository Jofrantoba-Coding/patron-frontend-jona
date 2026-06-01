// InterJToast.ts — JONA Interface
export type JToastVariant = 'default' | 'success' | 'warning' | 'danger';

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
