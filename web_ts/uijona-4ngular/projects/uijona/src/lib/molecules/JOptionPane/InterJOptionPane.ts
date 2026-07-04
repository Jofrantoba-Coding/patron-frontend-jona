export type JOptionPaneVariant = 'danger' | 'warning' | 'info';

/** Contrato publico de JOptionPane. */
export interface InterJOptionPane {
  open: boolean;
  title: string;
  description?: string;
  variant?: JOptionPaneVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}
