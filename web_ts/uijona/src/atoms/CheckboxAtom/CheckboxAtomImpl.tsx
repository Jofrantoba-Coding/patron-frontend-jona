// CheckboxAtomImpl.tsx — JONA Implementation (adapta Observer events → DOM events)
import React, { useState } from 'react';
import { InterCheckboxAtom, CHECKBOX_ATOM_DEFAULTS } from './InterCheckboxAtom';
import { CheckboxAtomView } from './CheckboxAtomView';

type CheckboxAtomImplProps = InterCheckboxAtom &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'>;

export const CheckboxAtomImpl = React.forwardRef<HTMLInputElement, CheckboxAtomImplProps>(
  ({ onCheckedChange, ...props }, ref) => {
    const resolved = { ...CHECKBOX_ATOM_DEFAULTS, ...props };
    const [internalChecked, setInternalChecked] = useState(resolved.checked);
    const effectiveChecked = props.checked ?? internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (resolved.disabled) return;
      setInternalChecked(e.target.checked);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <CheckboxAtomView
        {...resolved}
        checked={effectiveChecked}
        forwardedRef={ref}
        onChange={handleChange}
      />
    );
  }
);

CheckboxAtomImpl.displayName = 'CheckboxAtom';
