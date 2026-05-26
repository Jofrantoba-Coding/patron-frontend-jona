// InterJOptionPane.ts — JONA Interface
export type JOptionPaneVariant = 'danger' | 'warning' | 'info';

export interface InterJOptionPane {
  open:           boolean;
  title:          string;
  description?:   string;
  variant?:       JOptionPaneVariant;
  confirmLabel?:  string;
  cancelLabel?:   string;
  isLoading?:     boolean;
  // Observer events
  onConfirm: () => void;
  onCancel:  () => void;
}

export const JOPTIONPANE_DEFAULTS: Required<Pick<
  InterJOptionPane,
  'variant' | 'confirmLabel' | 'cancelLabel' | 'isLoading'
>> = {
  variant:      'danger',
  confirmLabel: 'Confirmar',
  cancelLabel:  'Cancelar',
  isLoading:    false,
};
