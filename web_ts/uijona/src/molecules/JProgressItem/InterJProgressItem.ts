// InterJProgressItem.ts — JONA Interface
import React from 'react';

export type JProgressItemVariant = 'default' | 'success' | 'warning' | 'danger';
export type JProgressItemSize    = 'sm' | 'md' | 'lg';

export interface InterJProgressItem {
  label:      string;
  value:      number;
  max?:       number;
  variant?:   JProgressItemVariant;
  size?:      JProgressItemSize;
  showValue?: boolean;
  className?: string;
  style?:     React.CSSProperties;
}

export const JPROGRESS_ITEM_DEFAULTS = {
  max:       100,
  variant:   'default',
  size:      'md',
  showValue: true,
} as const satisfies Required<Pick<InterJProgressItem, 'max' | 'variant' | 'size' | 'showValue'>>;
