// InterJDialog.ts — JONA Interface
import React from 'react';

export type JDialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface InterJDialog {
  open:              boolean;
  title?:            string;
  description?:      string;
  titleIcon?:        React.ReactNode;
  showCloseButton?:  boolean;
  size?:             JDialogSize;
  className?:        string;
  titleBarClassName?: string;
  contentClassName?: string;
  footerClassName?:  string;
  children?:         React.ReactNode;
  footer?:           React.ReactNode;
  // Observer events
  onClose?:   () => void;
  onOpened?:  () => void;
  onClosed?:  () => void;
  onConfirm?: () => void;
  onCancel?:  () => void;
}

export const JDIALOG_DEFAULTS: Required<Pick<InterJDialog, 'showCloseButton' | 'size'>> = {
  showCloseButton: true,
  size:            'md',
};
