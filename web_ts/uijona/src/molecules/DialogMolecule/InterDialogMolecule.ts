// InterDialogMolecule.ts — JONA Interface
import React from 'react';

export interface InterDialogMolecule {
  open: boolean;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  // Observer events
  onClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const DIALOG_MOLECULE_DEFAULTS: Required<Pick<InterDialogMolecule, 'showCloseButton'>> = {
  showCloseButton: true,
};
