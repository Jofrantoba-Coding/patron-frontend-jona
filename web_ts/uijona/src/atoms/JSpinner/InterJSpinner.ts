import React from 'react';

export type JSpinnerSize  = 'sm' | 'md' | 'lg' | 'xl';
export type JSpinnerColor = 'current' | 'primary' | 'white' | 'neutral';

export interface InterJSpinner {
  size?:      JSpinnerSize;
  color?:     JSpinnerColor;
  label?:     string;
  className?: string;
  style?:     React.CSSProperties;
}

export const JSPINNER_DEFAULTS = {
  size:  'md',
  color: 'current',
  label: 'Loading',
} as const satisfies Partial<InterJSpinner>;
