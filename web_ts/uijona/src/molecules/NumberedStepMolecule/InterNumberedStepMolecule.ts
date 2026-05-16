// InterNumberedStepMolecule.ts — JONA Interface

export interface InterNumberedStepMolecule {
  num: string;
  title: string;
  body: string;
  className?: string;
}

export const NUMBERED_STEP_MOLECULE_DEFAULTS: Partial<InterNumberedStepMolecule> = {};
