// InterDropdownMolecule.ts — JONA Interface
import React from 'react';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownGroup {
  label?: string;
  items: DropdownItem[];
}

export interface InterDropdownMolecule {
  trigger: React.ReactNode;
  groups: DropdownGroup[];
  align?: 'start' | 'end';
  className?: string;
  // Observer events
  onOpen?: () => void;
  onClose?: () => void;
  onItemSelect?: (label: string) => void;
  onDisabledItemClick?: (label: string) => void;
}
