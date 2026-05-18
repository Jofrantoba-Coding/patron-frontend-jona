import React from 'react';
import type { JButtonVariant } from '../JButton';

export type { JButtonVariant };

export interface InterJIcon {
  icon: React.ReactNode;
  label: string;
  variant?: JButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}

export const JICON_DEFAULTS = {
  variant: 'ghost',
  loading: false,
  disabled: false,
  type: 'button',
} as const satisfies Partial<InterJIcon>;
