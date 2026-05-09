// InterBorderLayout.ts — JONA Interface + defaults
import React from 'react';

export interface InterBorderLayout {
  north?: React.ReactNode;
  south?: React.ReactNode;
  east?: React.ReactNode;
  west?: React.ReactNode;
  center?: React.ReactNode;
  className?: string;
  // slot widths / heights overrideable
  northClassName?: string;
  southClassName?: string;
  eastClassName?: string;
  westClassName?: string;
  centerClassName?: string;
}

export const BORDER_LAYOUT_DEFAULTS: Required<Pick<InterBorderLayout,
  'northClassName' | 'southClassName' | 'eastClassName' | 'westClassName' | 'centerClassName'
>> = {
  northClassName:  'flex-none bg-primary-600 text-white px-4 py-3 shadow-md sm:px-6',
  southClassName:  'flex-none bg-neutral-700 text-white text-center text-xs px-4 py-3 sm:px-6',
  eastClassName:   'flex-none w-full border-t border-neutral-200 bg-neutral-100 p-4 md:w-56 md:border-l md:border-t-0',
  westClassName:   'flex-none w-full border-b border-neutral-200 bg-neutral-100 p-4 md:w-56 md:border-b-0 md:border-r',
  centerClassName: 'flex-1 overflow-auto p-4 sm:p-6',
};
