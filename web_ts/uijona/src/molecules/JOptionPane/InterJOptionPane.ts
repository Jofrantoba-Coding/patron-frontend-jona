// InterJOptionPane.ts — JONA Interface
import type React from 'react';

export type JOptionPaneVariant = 'danger' | 'warning' | 'info';
export type JOptionPaneInitialFocus = 'confirm' | 'cancel';

export interface InterJOptionPane {
  open:           boolean;
  title:          string;
  description?:   string;
  variant?:       JOptionPaneVariant;
  confirmLabel?:  string;
  cancelLabel?:   string;
  isLoading?:     boolean;
  /** Record summary shown between the description and the buttons; part of the pane description. */
  details?:       React.ReactNode;
  /** Button focused on open. Omitted: the pane itself takes focus (1.5.1). */
  initialFocus?:  JOptionPaneInitialFocus;
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
