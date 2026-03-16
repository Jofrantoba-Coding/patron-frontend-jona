// InputAtomImpl.tsx — JONA Implementation (adapta Observer events → DOM events)
import React from 'react';
import { InterInputAtom, INPUT_ATOM_DEFAULTS } from './InterInputAtom';
import { InputAtomView } from './InputAtomView';

type InputAtomImplProps = InterInputAtom &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown'>;

export const InputAtomImpl = React.forwardRef<HTMLInputElement, InputAtomImplProps>(
  ({ onChange, onBlur, onKeyDown, onEnterPress, onClear, ...props }, ref) => {
    const resolved = { ...INPUT_ATOM_DEFAULTS, ...props };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.(e.target.value, e);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
      onBlur?.(e.target.value, e);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onEnterPress?.((e.target as HTMLInputElement).value, e);
      if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') onClear?.();
      onKeyDown?.(e);
    };

    return (
      <InputAtomView
        {...resolved}
        forwardedRef={ref}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  }
);

InputAtomImpl.displayName = 'InputAtom';
