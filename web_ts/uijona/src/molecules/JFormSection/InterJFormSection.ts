// InterJFormSection.ts — JONA Interface
import React from 'react';

export type JFormSectionHeadingLevel = 2 | 3 | 4;

export interface InterJFormSection {
  /** Heading text; it is also the accessible name of the group. */
  title: string;
  description?: string;
  /** Error of the set of fields (for example a period range); part of the group description. */
  error?: string;
  headingLevel?: JFormSectionHeadingLevel;
  children: React.ReactNode;
}

export const JFORMSECTION_DEFAULTS = {
  headingLevel: 3,
} as const satisfies Required<Pick<InterJFormSection, 'headingLevel'>>;
