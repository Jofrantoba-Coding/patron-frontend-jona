// CheckboxAtomImpl.tsx — JONA Implementation (adapta Observer events → DOM events)
import React from 'react';
import { InterCheckboxAtom, CHECKBOX_ATOM_DEFAULTS } from './InterCheckboxAtom';
import { CheckboxAtomView } from './CheckboxAtomView';

type CheckboxAtomImplProps = InterCheckboxAtom &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'>;

export const CheckboxAtomImpl = React.forwardRef<HTMLInputElement, CheckboxAtomImplProps>(
  ({ onCheckedChange, ...props }, ref) => {
    const resolved = { ...CHECKBOX_ATOM_DEFAULTS, ...props };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (resolved.disabled) return;
      onCheckedChange?.(e.target.checked);
    };

    return <CheckboxAtomView {...resolved} forwardedRef={ref} onChange={handleChange} />;
  }
);

CheckboxAtomImpl.displayName = 'CheckboxAtom';
