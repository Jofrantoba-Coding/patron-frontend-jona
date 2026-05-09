// InterChipAtom.ts — JONA Interface
import React from 'react';

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface InterChipAtom extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  selected?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const CHIP_ATOM_DEFAULTS: Required<Pick<InterChipAtom, 'variant' | 'selected' | 'removable'>> = {
  variant: 'default',
  selected: false,
  removable: false,
};
