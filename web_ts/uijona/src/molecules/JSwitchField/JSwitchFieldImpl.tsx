// JSwitchFieldImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterJSwitchField, JSWITCHFIELD_DEFAULTS } from './InterJSwitchField';
import { JSwitchFieldView } from './JSwitchFieldView';

export const JSwitchFieldImpl: React.FC<InterJSwitchField> = (props) => {
  const isControlled      = props.checked !== undefined;
  const [internal, setInternal] = useState(false);
  const effectiveChecked  = isControlled ? props.checked! : internal;

  const handleCheckedChange = (checked: boolean) => {
    if (!isControlled) setInternal(checked);
    props.onCheckedChange?.(checked);
  };

  return (
    <JSwitchFieldView
      {...JSWITCHFIELD_DEFAULTS}
      {...props}
      checked={effectiveChecked}
      onCheckedChange={handleCheckedChange}
    />
  );
};

JSwitchFieldImpl.displayName = 'JSwitchField';
