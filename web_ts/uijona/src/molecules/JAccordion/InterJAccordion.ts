// InterJAccordion.ts — JONA Interface
import React from 'react';

export type JAccordionSize    = 'sm' | 'md' | 'lg';
export type JAccordionVariant = 'default' | 'bordered' | 'ghost';

export interface JAccordionItem {
  value:    string;
  title:    React.ReactNode;
  content:  React.ReactNode;
  disabled?: boolean;
  icon?:    React.ReactNode;
}

export interface InterJAccordion {
  items:         JAccordionItem[];
  value?:        string | string[];
  defaultValue?: string | string[];
  multiple?:     boolean;
  variant?:      JAccordionVariant;
  size?:         JAccordionSize;
  className?:    string;
  style?:        React.CSSProperties;
  // Observer
  onValueChange?: (value: string | string[]) => void;
}

export const JACCORDION_DEFAULTS = {
  multiple: false,
  variant:  'default',
  size:     'md',
} as const satisfies Required<Pick<InterJAccordion, 'multiple' | 'variant' | 'size'>>;
