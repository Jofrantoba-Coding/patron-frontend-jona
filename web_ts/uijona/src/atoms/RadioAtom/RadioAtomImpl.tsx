// RadioAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterRadioAtom, RADIO_ATOM_DEFAULTS } from './InterRadioAtom';
import { RadioAtomView } from './RadioAtomView';

type RadioAtomImplProps = InterRadioAtom &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked' | 'type'>;

export const RadioAtomImpl = React.forwardRef<HTMLInputElement, RadioAtomImplProps>(
  ({ onCheckedChange, ...props }, ref) => {
    const resolved = { ...RADIO_ATOM_DEFAULTS, ...props };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (resolved.disabled) return;
      onCheckedChange?.(event.target.checked, event.target.value, event);
    };

    return <RadioAtomView {...resolved} forwardedRef={ref} onChange={handleChange} />;
  }
);

RadioAtomImpl.displayName = 'RadioAtom';
