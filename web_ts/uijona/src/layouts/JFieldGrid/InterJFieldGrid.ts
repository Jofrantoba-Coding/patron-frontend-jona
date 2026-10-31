// InterJFieldGrid.ts — JONA Interface
import React from 'react';
import type { JPanelGap } from '../../atoms/JPanel';

export interface InterJFieldGrid {
  /** `JField`s; each takes its `span` of the 12 columns from `md`, and 12 below. */
  children: React.ReactNode;
  /** Space between fields, on the JPanel gap scale. */
  gap?: JPanelGap;
}

export const JFIELDGRID_DEFAULTS = {
  gap: 'md',
} as const satisfies Required<Pick<InterJFieldGrid, 'gap'>>;
