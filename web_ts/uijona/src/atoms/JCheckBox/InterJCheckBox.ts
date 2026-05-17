import React from 'react';

export type JCheckBoxSize = 'sm' | 'md' | 'lg';

export interface InterJCheckBox {
  // Estado
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  hasError?: boolean;
  disabled?: boolean;

  // Visual
  size?: JCheckBoxSize;

  // Formulario
  id?: string;
  name?: string;
  value?: string;

  // Estándar
  className?: string;
  style?: React.CSSProperties;

  // Observer events — value-first
  onCheckedChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const JCHECKBOX_DEFAULTS = {
  hasError:      false,
  disabled:      false,
  indeterminate: false,
  size:          'md',
} as const satisfies Required<Pick<InterJCheckBox, 'hasError' | 'disabled' | 'indeterminate' | 'size'>>;

export const JCHECKBOX_SIZES: Record<JCheckBoxSize, string> = {
  sm: 'h-3 w-3 — 12px',
  md: 'h-4 w-4 — 16px (default)',
  lg: 'h-5 w-5 — 20px',
};
