// InterJAuthLayout.ts — JONA Interface
import type React from 'react';

export interface JAuthLayoutBrand {
  /** The product name: shown in the card and, from lg, in the brand panel. */
  name: string;
  tagline?: string;
  logo?: React.ReactNode;
}

export interface JAuthLayoutStep {
  id: string;
  label: string;
}

export interface InterJAuthLayout {
  brand: JAuthLayoutBrand;
  /** With steps, a JStepper shows them; the step whose id is `currentStep` carries `aria-current="step"`. */
  steps?: JAuthLayoutStep[];
  currentStep?: string;
  /** The page heading (h1, page-title style). */
  title: string;
  description?: string;
  /** The host's form: the layout holds no form logic. */
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** The auth layout has no optional prop with a default. */
export const JAUTHLAYOUT_DEFAULTS = {} as const;
