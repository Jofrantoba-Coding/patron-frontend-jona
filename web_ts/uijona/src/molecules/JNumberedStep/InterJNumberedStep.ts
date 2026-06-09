// InterJNumberedStep.ts — JONA Interface

export interface InterJNumberedStep {
  num: string;
  title: string;
  body: string;
  className?: string;
}

export const JNUMBERED_STEP_DEFAULTS: Partial<InterJNumberedStep> = {};
