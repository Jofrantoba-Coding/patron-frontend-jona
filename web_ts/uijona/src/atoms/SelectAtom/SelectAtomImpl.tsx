// SelectAtomImpl.tsx — JONA Implementation (adapta Observer events → DOM events)
import React from 'react';
import { InterSelectAtom, SELECT_ATOM_DEFAULTS } from './InterSelectAtom';
import { SelectAtomView } from './SelectAtomView';

type SelectAtomImplProps = Omit<InterSelectAtom, 'onChange' | 'onBlur'> &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur' | 'value'> & {
    value?: string;
    onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
  };

export const SelectAtomImpl = React.forwardRef<HTMLSelectElement, SelectAtomImplProps>(
  ({ onChange, onBlur, ...props }, ref) => {
    const resolved = { ...SELECT_ATOM_DEFAULTS, ...props };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
      onChange?.(e.target.value, e);

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) =>
      onBlur?.(e.target.value, e);

    return (
      <SelectAtomView
        {...resolved}
        forwardedRef={ref}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  }
);

SelectAtomImpl.displayName = 'SelectAtom';
