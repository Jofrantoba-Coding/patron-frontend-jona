// InterJAlert.ts — JONA Interface
import React from 'react';

export type JAlertVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';

export interface InterJAlert extends React.HTMLAttributes<HTMLDivElement> {
  variant?:     JAlertVariant;
  title?:       string;
  icon?:        React.ReactNode;
  dismissible?: boolean;
  // Observer
  onDismiss?:   () => void;
}

export const JALERT_DEFAULTS = {
  variant:     'default',
  dismissible: false,
} as const satisfies Required<Pick<InterJAlert, 'variant' | 'dismissible'>>;
