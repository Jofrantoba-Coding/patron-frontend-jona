// InterSectionHeadingMolecule.ts — JONA Interface

export interface InterSectionHeadingMolecule {
  eyebrow?: string;
  heading: string;
  description?: string;
  className?: string;
}

export const SECTION_HEADING_MOLECULE_DEFAULTS: Partial<InterSectionHeadingMolecule> = {};
