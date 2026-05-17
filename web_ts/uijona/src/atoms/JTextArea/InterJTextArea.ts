import React from 'react';

export type JTextAreaResize  = 'none' | 'vertical' | 'horizontal' | 'both';
export type JTextAreaSize    = 'sm' | 'md' | 'lg';
export type JTextAreaVariant = 'default' | 'filled';

export interface InterJTextArea {
  // Comportamiento
  hasError?:   boolean;
  autoResize?: boolean;
  resize?:     JTextAreaResize;
  disabled?:   boolean;

  // Visual
  size?:    JTextAreaSize;
  variant?: JTextAreaVariant;

  // Formulario
  id?:          string;
  name?:        string;
  placeholder?: string;
  required?:    boolean;
  rows?:        number;
  maxLength?:   number;
  value?:       string;
  defaultValue?: string;

  // Estándar
  className?: string;
  style?:     React.CSSProperties;

  // Observer events — value-first
  onChange?:  (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?:   (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?:    (value: string, event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const JTEXTAREA_DEFAULTS = {
  hasError:   false,
  autoResize: false,
  resize:     'both',
  disabled:   false,
  size:       'md',
  variant:    'default',
} as const satisfies Required<Pick<InterJTextArea,
  'hasError' | 'autoResize' | 'resize' | 'disabled' | 'size' | 'variant'>>;

export const JTEXTAREA_RESIZES: Record<JTextAreaResize, string> = {
  none:       'resize-none',
  vertical:   'resize-y',
  horizontal: 'resize-x',
  both:       'resize',
};

export const JTEXTAREA_SIZES: Record<JTextAreaSize, string> = {
  sm: 'min-h-[60px]  text-xs  px-2 py-1.5 — pequeño',
  md: 'min-h-[80px]  text-sm  px-3 py-2   — mediano (default)',
  lg: 'min-h-[100px] text-base px-4 py-2.5 — grande',
};

export const JTEXTAREA_VARIANTS: Record<JTextAreaVariant, string> = {
  default: 'Fondo blanco, borde neutral.',
  filled:  'Fondo neutro claro, borde suave.',
};
