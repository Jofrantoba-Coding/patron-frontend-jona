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
  northClassName:  'px-4 py-3 sm:px-6',
  southClassName:  'px-4 py-3 text-xs sm:px-6',
  westClassName:   'w-full border-b border-neutral-200 p-4 md:w-56 md:border-b-0 md:border-r',
  eastClassName:   'w-full border-t border-neutral-200 p-4 md:w-56 md:border-l md:border-t-0',
  centerClassName: 'p-4 sm:p-6',
} as const satisfies Partial<InterBorderLayout>;
