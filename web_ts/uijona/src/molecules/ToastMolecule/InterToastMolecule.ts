// InterToastMolecule.ts — JONA Interface

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

export interface InterToastMolecule {
  id: string;
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
  // Observer events
  onDismiss?: (id: string) => void;
}
