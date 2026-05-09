// InterRadioGroupMolecule.ts — JONA Interface
import React from 'react';

export interface RadioGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface InterRadioGroupMolecule {
  name: string;
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  label?: React.ReactNode;
  errorMessage?: React.ReactNode;
  description?: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
  // Observer events
  onValueChange?: (value: string, option: RadioGroupOption) => void;
}

export const RADIO_GROUP_MOLECULE_DEFAULTS: Required<Pick<InterRadioGroupMolecule, 'orientation' | 'disabled'>> = {
  orientation: 'vertical',
  disabled: false,
};
