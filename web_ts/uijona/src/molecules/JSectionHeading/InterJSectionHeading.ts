// InterJSectionHeading.ts — JONA Interface

export interface InterJSectionHeading {
  eyebrow?: string;
  heading: string;
  description?: string;
  className?: string;
}

export const JSECTION_HEADING_DEFAULTS: Partial<InterJSectionHeading> = {};
