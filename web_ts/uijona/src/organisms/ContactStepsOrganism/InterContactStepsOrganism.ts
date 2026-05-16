// InterContactStepsOrganism.ts — JONA Interface

export interface ContactStepData {
  num: string;
  title: string;
  body: string;
}

export interface InterContactStepsOrganism {
  eyebrow?: string;
  heading: string;
  steps: ContactStepData[];
  as?: 'section' | 'div';
  className?: string;
}

export const CONTACT_STEPS_ORGANISM_DEFAULTS: Partial<InterContactStepsOrganism> = {
  as: 'section',
};
