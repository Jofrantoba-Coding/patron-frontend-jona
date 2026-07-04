export type JDialogSize = 'sm' | 'md' | 'lg' | 'xl';

/** Contrato publico de JDialog. */
export interface InterJDialog {
  open: boolean;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  size?: JDialogSize;
}
