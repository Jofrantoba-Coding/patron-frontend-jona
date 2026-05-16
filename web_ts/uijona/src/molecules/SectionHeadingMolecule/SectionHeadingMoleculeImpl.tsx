// SectionHeadingMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterSectionHeadingMolecule, SECTION_HEADING_MOLECULE_DEFAULTS } from './InterSectionHeadingMolecule';
import { SectionHeadingMoleculeView } from './SectionHeadingMoleculeView';

export const SectionHeadingMoleculeImpl: React.FC<InterSectionHeadingMolecule> = (props) => (
  <SectionHeadingMoleculeView {...SECTION_HEADING_MOLECULE_DEFAULTS} {...props} />
);
