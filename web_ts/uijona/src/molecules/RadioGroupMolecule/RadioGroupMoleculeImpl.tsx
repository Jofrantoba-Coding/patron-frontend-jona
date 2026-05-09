// RadioGroupMoleculeImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import {
  InterRadioGroupMolecule,
  RADIO_GROUP_MOLECULE_DEFAULTS,
  RadioGroupOption,
} from './InterRadioGroupMolecule';
import { RadioGroupMoleculeView } from './RadioGroupMoleculeView';

export const RadioGroupMoleculeImpl: React.FC<InterRadioGroupMolecule> = (props) => {
  const resolved = { ...RADIO_GROUP_MOLECULE_DEFAULTS, ...props };
  const [internalValue, setInternalValue] = useState(resolved.defaultValue);
  const selectedValue = resolved.value ?? internalValue;

  const handleOptionChange = (option: RadioGroupOption) => {
    if (resolved.value === undefined) setInternalValue(option.value);
    resolved.onValueChange?.(option.value, option);
  };

  return (
    <RadioGroupMoleculeView
      {...resolved}
      selectedValue={selectedValue}
      onOptionChange={handleOptionChange}
    />
  );
};

RadioGroupMoleculeImpl.displayName = 'RadioGroupMolecule';
