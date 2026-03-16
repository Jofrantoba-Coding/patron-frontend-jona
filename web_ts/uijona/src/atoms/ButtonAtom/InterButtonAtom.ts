// InterButtonAtom.ts — JONA Interface
import React from 'react';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface InterButtonAtom {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  // Observer events
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const BUTTON_ATOM_DEFAULTS: Required<Pick<InterButtonAtom, 'variant' | 'size' | 'loading' | 'fullWidth'>> = {
  variant:   'default',
  size:      'default',
  loading:   false,
  fullWidth: false,
};
