// JCheckBoxFieldImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterJCheckBoxField, JCHECKBOX_FIELD_DEFAULTS } from './InterJCheckBoxField';
import { JCheckBoxFieldView } from './JCheckBoxFieldView';

export const JCheckBoxFieldImpl: React.FC<InterJCheckBoxField> = (props) => {
  const [internalChecked, setInternalChecked] = useState(
    props.checked ?? JCHECKBOX_FIELD_DEFAULTS.checked
  );
  const effectiveChecked = props.checked ?? internalChecked;

  const handleCheckedChange = (checked: boolean) => {
    setInternalChecked(checked);
    props.onCheckedChange?.(checked);
  };

  return (
    <JCheckBoxFieldView
      {...JCHECKBOX_FIELD_DEFAULTS}
      {...props}
      checked={effectiveChecked}
      onCheckedChange={handleCheckedChange}
    />
  );
};

JCheckBoxFieldImpl.displayName = 'JCheckBoxField';
