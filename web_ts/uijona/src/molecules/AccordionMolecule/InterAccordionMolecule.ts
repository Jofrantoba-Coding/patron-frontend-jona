// InterAccordionMolecule.ts — JONA Interface
import React from 'react';

export interface AccordionItem {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface InterAccordionMolecule {
  items: AccordionItem[];
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  className?: string;
  // Observer events
  onValueChange?: (value: string | string[]) => void;
}

export const ACCORDION_MOLECULE_DEFAULTS: Required<Pick<InterAccordionMolecule, 'multiple'>> = {
  multiple: false,
};
