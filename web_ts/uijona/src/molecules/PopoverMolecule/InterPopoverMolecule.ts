// InterPopoverMolecule.ts — JONA Interface + defaults
import React from 'react';

export type PopoverAlign = 'start' | 'center' | 'end';
export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

export interface InterPopoverMolecule {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: PopoverAlign;
  side?: PopoverSide;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export const POPOVER_MOLECULE_DEFAULTS: Required<Pick<InterPopoverMolecule, 'align' | 'side'>> = {
  align: 'start',
  side: 'bottom',
};
