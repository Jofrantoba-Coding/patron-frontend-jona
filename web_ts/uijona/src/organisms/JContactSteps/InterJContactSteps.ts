// InterJContactSteps.ts — JONA Interface

export interface ContactStepData {
  num: string;
  title: string;
  body: string;
}

export interface InterJContactSteps {
  eyebrow?: string;
  heading: string;
  steps: ContactStepData[];
  as?: 'section' | 'div';
  className?: string;
}

export const JCONTACT_STEPS_DEFAULTS: Partial<InterJContactSteps> = {
  as: 'section',
};
