// JRadioGroupImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import {
  InterJRadioGroup,
  JRADIO_GROUP_DEFAULTS,
  JRadioGroupOption,
} from './InterJRadioGroup';
import { JRadioGroupView } from './JRadioGroupView';

export const JRadioGroupImpl: React.FC<InterJRadioGroup> = (props) => {
  const resolved = { ...JRADIO_GROUP_DEFAULTS, ...props };
  const [internalValue, setInternalValue] = useState(resolved.defaultValue);
  const selectedValue = resolved.value ?? internalValue;

  const handleOptionChange = (option: JRadioGroupOption) => {
    if (resolved.value === undefined) setInternalValue(option.value);
    resolved.onValueChange?.(option.value, option);
  };

  return (
    <JRadioGroupView
      {...resolved}
      selectedValue={selectedValue}
      onOptionChange={handleOptionChange}
    />
  );
};

JRadioGroupImpl.displayName = 'JRadioGroup';
