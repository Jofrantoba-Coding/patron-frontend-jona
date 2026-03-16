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
  northClassName:  'flex-none bg-primary-600 text-white px-6 py-3 shadow-md',
  southClassName:  'flex-none bg-neutral-700 text-white text-center text-xs py-3 px-6',
  eastClassName:   'flex-none w-56 bg-neutral-100 border-l border-neutral-200 p-4',
  westClassName:   'flex-none w-56 bg-neutral-100 border-r border-neutral-200 p-4',
  centerClassName: 'flex-1 overflow-auto p-6',
};
