import React from 'react';

export type JProgressVariant = 'default' | 'success' | 'warning' | 'danger';
export type JProgressType    = 'bar' | 'circle';
export type JProgressSize    = 'sm' | 'md' | 'lg';

export interface InterJProgress {
  value?:     number;
  max?:       number;
  variant?:   JProgressVariant;
  type?:      JProgressType;
  size?:      JProgressSize;
  showLabel?: boolean;
  label?:     string;
  animated?:  boolean;
  className?: string;
  style?:     React.CSSProperties;
}

export const JPROGRESS_DEFAULTS = {
  value:     0,
  max:       100,
  variant:   'default',
  type:      'bar',
  size:      'md',
  showLabel: false,
  animated:  false,
} as const satisfies Partial<InterJProgress>;
