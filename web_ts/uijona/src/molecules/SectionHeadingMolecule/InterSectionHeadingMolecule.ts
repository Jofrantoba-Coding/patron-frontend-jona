// InterSectionHeadingMolecule.ts — JONA Interface
import type { EyebrowVariant } from '../../atoms/EyebrowAtom/InterEyebrowAtom';

export type SectionHeadingAlign = 'left' | 'center';
export type SectionHeadingTone = 'light' | 'dark';

export interface InterSectionHeadingMolecule {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: SectionHeadingAlign;
  tone?: SectionHeadingTone;
  eyebrowVariant?: EyebrowVariant;
  className?: string;
}

export const SECTION_HEADING_MOLECULE_DEFAULTS: Required<
  Pick<InterSectionHeadingMolecule, 'align' | 'tone' | 'eyebrowVariant'>
> = {
  align: 'left',
  tone: 'light',
  eyebrowVariant: 'primary',
};
