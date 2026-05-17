import React from 'react';

export interface JComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface JComboBoxGroup {
  label: string;
  options: JComboBoxOption[];
}

export type JComboBoxSize    = 'sm' | 'md' | 'lg';
export type JComboBoxVariant = 'default' | 'filled';

export interface InterJComboBox {
  // Datos
  options?:     JComboBoxOption[];
  groups?:      JComboBoxGroup[];
  placeholder?: string;

  // Estado
  value?:    string;
  hasError?: boolean;
  disabled?: boolean;

  // Visual
  size?:    JComboBoxSize;
  variant?: JComboBoxVariant;

  // Formulario
  id?:              string;
  name?:            string;
  required?:        boolean;
  'aria-describedby'?: string;

  // Estándar
  className?: string;
  style?:     React.CSSProperties;

  // Observer events — value-first
  onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus?:  (event: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?:   (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
}

export const JCOMBOBOX_DEFAULTS = {
  hasError: false,
  disabled: false,
  size:     'md',
  variant:  'default',
} as const satisfies Required<Pick<InterJComboBox, 'hasError' | 'disabled' | 'size' | 'variant'>>;

export const JCOMBOBOX_SIZES: Record<JComboBoxSize, string> = {
  sm: 'h-7 text-xs px-2 py-0.5 — pequeño',
  md: 'h-9 text-sm px-3 py-1  — mediano (default)',
  lg: 'h-11 text-base px-4 py-2 — grande',
};

export const JCOMBOBOX_VARIANTS: Record<JComboBoxVariant, string> = {
  default: 'Fondo blanco, borde neutral.',
  filled:  'Fondo neutro claro, borde suave.',
};
