// ChipAtomImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { CHIP_ATOM_DEFAULTS, InterChipAtom } from './InterChipAtom';
import { ChipAtomView } from './ChipAtomView';

export const ChipAtomImpl: React.FC<InterChipAtom> = ({ selected, onClick, ...props }) => {
  const [internalSelected, setInternalSelected] = useState(selected ?? CHIP_ATOM_DEFAULTS.selected);
  const effectiveSelected = selected ?? internalSelected;

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    setInternalSelected(!effectiveSelected);
    onClick?.(e);
  };

  return (
    <ChipAtomView
      {...CHIP_ATOM_DEFAULTS}
      {...props}
      selected={effectiveSelected}
      onClick={handleClick}
    />
  );
};

ChipAtomImpl.displayName = 'ChipAtom';
