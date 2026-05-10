// SwitchFieldMoleculeImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterSwitchFieldMolecule, SWITCH_FIELD_MOLECULE_DEFAULTS } from './InterSwitchFieldMolecule';
import { SwitchFieldMoleculeView } from './SwitchFieldMoleculeView';

export const SwitchFieldMoleculeImpl: React.FC<InterSwitchFieldMolecule> = (props) => {
  const [internalChecked, setInternalChecked] = useState(
    props.checked ?? SWITCH_FIELD_MOLECULE_DEFAULTS.checked
  );
  const effectiveChecked = props.checked ?? internalChecked;

  const handleCheckedChange = (checked: boolean) => {
    setInternalChecked(checked);
    props.onCheckedChange?.(checked);
  };

  return (
    <SwitchFieldMoleculeView
      {...SWITCH_FIELD_MOLECULE_DEFAULTS}
      {...props}
      checked={effectiveChecked}
      onCheckedChange={handleCheckedChange}
    />
  );
};

SwitchFieldMoleculeImpl.displayName = 'SwitchFieldMolecule';
