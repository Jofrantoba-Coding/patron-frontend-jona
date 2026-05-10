// CheckboxFieldMoleculeImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterCheckboxFieldMolecule, CHECKBOX_FIELD_MOLECULE_DEFAULTS } from './InterCheckboxFieldMolecule';
import { CheckboxFieldMoleculeView } from './CheckboxFieldMoleculeView';

export const CheckboxFieldMoleculeImpl: React.FC<InterCheckboxFieldMolecule> = (props) => {
  const [internalChecked, setInternalChecked] = useState(
    props.checked ?? CHECKBOX_FIELD_MOLECULE_DEFAULTS.checked
  );
  const effectiveChecked = props.checked ?? internalChecked;

  const handleCheckedChange = (checked: boolean) => {
    setInternalChecked(checked);
    props.onCheckedChange?.(checked);
  };

  return (
    <CheckboxFieldMoleculeView
      {...CHECKBOX_FIELD_MOLECULE_DEFAULTS}
      {...props}
      checked={effectiveChecked}
      onCheckedChange={handleCheckedChange}
    />
  );
};

CheckboxFieldMoleculeImpl.displayName = 'CheckboxFieldMolecule';
