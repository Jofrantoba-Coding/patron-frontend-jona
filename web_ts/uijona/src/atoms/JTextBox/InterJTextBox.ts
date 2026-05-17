import React from 'react';

export type JTextBoxVariant = 'default' | 'filled' | 'ghost';
export type JTextBoxSize = 'sm' | 'md' | 'lg';
export type JTextBoxType =
  | 'text' | 'email' | 'password' | 'number' | 'tel'
  | 'url' | 'search' | 'date' | 'time' | 'datetime-local';

export interface InterJTextBox {
  // Valor
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  name?: string;
  id?: string;

  // Apariencia
  variant?: JTextBoxVariant;
  size?: JTextBoxSize;
  type?: JTextBoxType;

  // Iconos internos
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;

  // Estado
  hasError?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  // Estándar
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;

  // Observer events — value-first (patrón JONA)
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
  onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

export const JTEXTBOX_DEFAULTS = {
  variant: 'default',
  size: 'md',
  type: 'text',
  hasError: false,
} as const satisfies Required<Pick<InterJTextBox, 'variant' | 'size' | 'type' | 'hasError'>>;

export const JTEXTBOX_VARIANTS: Record<JTextBoxVariant, string> = {
  default: 'Borde neutral + fondo claro. Uso general.',
  filled:  'Sin borde, fondo neutro más oscuro. Formularios sobre fondo blanco.',
  ghost:   'Sin borde, fondo transparente. Inline o sobre fondos con textura.',
};

export const JTEXTBOX_SIZES: Record<JTextBoxSize, string> = {
  sm: '28px altura. Tablas, filtros compactos.',
  md: '36px altura. Tamaño por defecto.',
  lg: '44px altura. Formularios destacados.',
};
