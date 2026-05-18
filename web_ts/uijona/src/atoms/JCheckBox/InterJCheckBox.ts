import React from 'react';

export type JCheckBoxSize          = 'sm' | 'md' | 'lg';
export type JCheckBoxLabelPosition = 'right' | 'left' | 'top' | 'bottom';

export interface InterJCheckBox {
  // Estado
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  hasError?: boolean;
  disabled?: boolean;

  // Visual
  size?: JCheckBoxSize;

  // Label integrado
  label?: string;
  labelPosition?: JCheckBoxLabelPosition;
  labelClassName?: string;

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
  hasError:       false,
  disabled:       false,
  indeterminate:  false,
  size:           'md',
  labelPosition:  'right',
} as const satisfies Partial<InterJCheckBox>;
