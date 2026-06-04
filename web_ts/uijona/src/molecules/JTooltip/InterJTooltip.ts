// InterJTooltip.ts — JONA Interface
import React from 'react';

export type JTooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface InterJTooltip {
  content:    React.ReactNode;
  side?:      JTooltipSide;
  delayMs?:   number;
  className?: string;
  children:   React.ReactElement;
  onShow?:    () => void;
  onHide?:    () => void;
}

export const JTOOLTIP_DEFAULTS: Required<Pick<InterJTooltip, 'side' | 'delayMs'>> = {
  side:    'top',
  delayMs: 300,
};
