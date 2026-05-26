// InterJDialog.ts — JONA Interface
import React from 'react';

export interface InterJDialog {
  open:             boolean;
  title?:           string;
  description?:     string;
  showCloseButton?: boolean;
  className?:       string;
  children?:        React.ReactNode;
  footer?:          React.ReactNode;
  // Observer events
  onClose?:   () => void;
  onOpened?:  () => void;
  onClosed?:  () => void;
  onConfirm?: () => void;
  onCancel?:  () => void;
}

export const JDIALOG_DEFAULTS: Required<Pick<InterJDialog, 'showCloseButton'>> = {
  showCloseButton: true,
};
