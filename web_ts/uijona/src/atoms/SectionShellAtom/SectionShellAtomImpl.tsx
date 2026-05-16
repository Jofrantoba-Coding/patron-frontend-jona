// SectionShellAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterSectionShellAtom, SECTION_SHELL_ATOM_DEFAULTS } from './InterSectionShellAtom';
import { SectionShellAtomView } from './SectionShellAtomView';

export const SectionShellAtomImpl: React.FC<InterSectionShellAtom> = (props) => (
  <SectionShellAtomView {...SECTION_SHELL_ATOM_DEFAULTS} {...props} />
);
