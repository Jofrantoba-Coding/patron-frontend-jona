// SwitchAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterSwitchAtom, SWITCH_ATOM_DEFAULTS } from './InterSwitchAtom';
import { SwitchAtomView } from './SwitchAtomView';

export const SwitchAtomImpl: React.FC<InterSwitchAtom & { id?: string; 'aria-labelledby'?: string }> = ({
  onCheckedChange, ...props
}) => {
  const resolved = { ...SWITCH_ATOM_DEFAULTS, ...props };
  return (
    <SwitchAtomView
      {...resolved}
      onClick={() => onCheckedChange?.(!resolved.checked)}
    />
  );
};

SwitchAtomImpl.displayName = 'SwitchAtom';
