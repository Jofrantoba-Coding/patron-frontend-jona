// ChipAtomImpl.tsx — JONA Implementation
import React from 'react';
import { CHIP_ATOM_DEFAULTS, InterChipAtom } from './InterChipAtom';
import { ChipAtomView } from './ChipAtomView';

export const ChipAtomImpl: React.FC<InterChipAtom> = (props) => (
  <ChipAtomView {...CHIP_ATOM_DEFAULTS} {...props} />
);

ChipAtomImpl.displayName = 'ChipAtom';
