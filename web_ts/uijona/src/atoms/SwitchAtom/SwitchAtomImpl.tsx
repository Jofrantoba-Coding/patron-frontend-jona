// SwitchAtomImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterSwitchAtom, SWITCH_ATOM_DEFAULTS } from './InterSwitchAtom';
import { SwitchAtomView } from './SwitchAtomView';

export const SwitchAtomImpl: React.FC<InterSwitchAtom & { id?: string; 'aria-labelledby'?: string }> = ({
  onCheckedChange, ...props
}) => {
  const resolved = { ...SWITCH_ATOM_DEFAULTS, ...props };
  const [internalChecked, setInternalChecked] = useState(resolved.checked);
  const effectiveChecked = props.checked ?? internalChecked;

  const handleClick = () => {
    if (resolved.disabled) return;
    setInternalChecked(!effectiveChecked);
    onCheckedChange?.(!effectiveChecked);
  };

  return (
    <SwitchAtomView
      {...resolved}
      checked={effectiveChecked}
      onClick={handleClick}
    />
  );
};

SwitchAtomImpl.displayName = 'SwitchAtom';
