// InterJTabs.ts — JONA Interface
import React from 'react';

export interface InterJTabs {
  value:                 string;
  variant?:              'pill' | 'line';
  orientation?:          'horizontal' | 'vertical';
  /** Inactive contents stay mounted and `hidden`, so their state survives (R-CHR-5). */
  keepMounted?:          boolean;
  className?:            string;
  children:              React.ReactNode;
  onChange?:             (value: string) => void;
  onTabFocus?:           (value: string) => void;
  onDisabledTabClick?:   (value: string) => void;
}

export const JTABS_DEFAULTS: Required<Pick<InterJTabs, 'variant' | 'orientation' | 'keepMounted'>> = {
  variant:     'pill',
  orientation: 'horizontal',
  keepMounted: false,
};

export interface InterJTabsTrigger extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value:         string;
  /** Shows an error dot and adds `invalidLabel` to the description; the name is unchanged. */
  invalid?:      boolean;
  invalidLabel?: string;
  /** Shown next to the label and added to the description, never to the name. */
  count?:        number;
}

export const JTABS_TRIGGER_DEFAULTS: Required<Pick<InterJTabsTrigger, 'invalidLabel'>> = {
  invalidLabel: 'Con errores',
};
