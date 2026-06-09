// InterJRadioGroup.ts — JONA Interface
import React from 'react';

export interface JRadioGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface InterJRadioGroup {
  name: string;
  options: JRadioGroupOption[];
  value?: string;
  defaultValue?: string;
  label?: React.ReactNode;
  errorMessage?: React.ReactNode;
  description?: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
  // Observer events
  onValueChange?: (value: string, option: JRadioGroupOption) => void;
}

export const JRADIO_GROUP_DEFAULTS: Required<Pick<InterJRadioGroup, 'orientation' | 'disabled'>> = {
  orientation: 'vertical',
  disabled: false,
};
