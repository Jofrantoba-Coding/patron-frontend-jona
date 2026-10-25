// InterJInputGroup.ts — JONA Interface
import React from 'react';

export type JInputGroupPreset = 'default' | 'lookup';

export interface InterJInputGroup {
  children: React.ReactNode;
  addonStart?: React.ReactNode;
  /** One cell at its content width (for example the lookup action buttons). */
  addonEnd?: React.ReactNode;
  /** `lookup`: code, description and actions; one row from sm, bottom-aligned, stacked below. */
  preset?: JInputGroupPreset;
  /** A grid-template-columns value used from sm, through a CSS variable (D4). */
  columns?: string;
  ariaLabel?: string;
  invalid?: boolean;
}

export const JINPUTGROUP_DEFAULTS = {
  preset: 'default',
} as const satisfies Required<Pick<InterJInputGroup, 'preset'>>;

/** The template of the `lookup` preset: code, description, actions. */
export const JINPUTGROUP_LOOKUP_COLUMNS = '10rem 1fr auto';
