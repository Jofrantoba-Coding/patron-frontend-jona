// InterJPageHeader.ts — JONA Interface
import React from 'react';

export type JPageHeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface JPageHeaderCrumb {
  id: string;
  label: string;
}

export interface InterJPageHeader {
  /** The heading text; the heading takes programmatic focus (`tabIndex=-1`). */
  title: string;
  /** Shown as `(134)` next to the title, outside the heading's name. */
  count?: number;
  /** Ancestors first; the last crumb is the current page. */
  breadcrumbs?: JPageHeaderCrumb[];
  breadcrumbLabel?: string;
  actions?: React.ReactNode;
  search?: React.ReactNode;
  headingLevel?: JPageHeaderLevel;
  /** Observer event — value-first: the id of the selected ancestor. Without it, ancestors are text. */
  onBreadcrumbSelect?: (id: string) => void;
}

export const JPAGEHEADER_DEFAULTS = {
  breadcrumbLabel: 'Ruta',
  headingLevel: 1,
} as const satisfies Required<Pick<InterJPageHeader, 'breadcrumbLabel' | 'headingLevel'>>;
