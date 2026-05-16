// InterSectionShellAtom.ts — JONA Interface
import React from 'react';

export type SectionShellMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface InterSectionShellAtom extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  maxWidth?: SectionShellMaxWidth;
}

export const SECTION_SHELL_ATOM_DEFAULTS: Required<Pick<InterSectionShellAtom, 'maxWidth'>> = {
  maxWidth: 'xl',
};
