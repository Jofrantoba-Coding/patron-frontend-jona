import React from 'react';
import type { JButtonDensity, JButtonVariant } from '../JButton';

export type { JButtonVariant };

export interface InterJIcon {
  icon: React.ReactNode;
  /** The accessible name (`aria-label`) of the icon-only button. */
  label: string;
  variant?: JButtonVariant;
  /** Height override, as on JButton. No default. */
  density?: JButtonDensity;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  'aria-describedby'?: string;
  'aria-keyshortcuts'?: string;
  'aria-pressed'?: React.AriaAttributes['aria-pressed'];
  'aria-expanded'?: React.AriaAttributes['aria-expanded'];
  'aria-controls'?: string;
  'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
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
