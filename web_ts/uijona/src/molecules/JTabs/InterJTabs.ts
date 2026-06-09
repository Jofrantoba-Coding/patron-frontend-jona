// InterJTabs.ts — JONA Interface
import React from 'react';

export interface InterJTabs {
  value:                 string;
  variant?:              'pill' | 'line';
  orientation?:          'horizontal' | 'vertical';
  className?:            string;
  children:              React.ReactNode;
  onChange?:             (value: string) => void;
  onTabFocus?:           (value: string) => void;
  onDisabledTabClick?:   (value: string) => void;
}

export const JTABS_DEFAULTS: Required<Pick<InterJTabs, 'variant' | 'orientation'>> = {
  variant:     'pill',
  orientation: 'horizontal',
};
