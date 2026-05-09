// RadioAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterRadioAtom } from './InterRadioAtom';

interface RadioAtomViewProps extends InterRadioAtom {
  forwardedRef?: React.Ref<HTMLInputElement>;
  [key: string]: unknown;
}

export const RadioAtomView: React.FC<RadioAtomViewProps> = ({
  checked, hasError, disabled, className, onFocus, onBlur, forwardedRef, ...rest
}) => (
  <input
    ref={forwardedRef}
    type="radio"
    checked={checked}
    disabled={disabled}
    onFocus={onFocus}
    onBlur={onBlur}
    className={cn(
      'h-4 w-4 border cursor-pointer',
      'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500',
      'disabled:pointer-events-none disabled:opacity-50',
      hasError ? 'border-danger-500 text-danger-500' : 'border-neutral-300 text-primary-600',
      className
    )}
    {...rest}
  />
);
