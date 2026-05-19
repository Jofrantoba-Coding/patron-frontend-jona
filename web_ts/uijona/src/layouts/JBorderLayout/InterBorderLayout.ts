// InterBorderLayout.ts — JONA Interface + defaults
import React from 'react';

export interface InterBorderLayout {
  north?: React.ReactNode;
  south?: React.ReactNode;
  east?: React.ReactNode;
  west?: React.ReactNode;
  center?: React.ReactNode;
  // extra classes per slot (structure is already applied by the layout)
  northClassName?: string;
  southClassName?: string;
  eastClassName?: string;
  westClassName?: string;
  centerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BORDER_LAYOUT_DEFAULTS = {
  northClassName:  'px-4 py-3',
  southClassName:  'px-4 py-3 text-xs',
  westClassName:   'border-b border-neutral-200 p-4 sm:border-b-0 sm:border-r',
  eastClassName:   'border-t border-neutral-200 p-4 sm:border-t-0 sm:border-l',
  centerClassName: 'p-4 sm:p-6',
} as const satisfies Partial<InterBorderLayout>;
