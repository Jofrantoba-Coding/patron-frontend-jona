// CheckboxAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterCheckboxAtom } from './InterCheckboxAtom';

interface CheckboxAtomViewProps extends InterCheckboxAtom {
  forwardedRef?: React.Ref<HTMLInputElement>;
  [key: string]: unknown;
}

export const CheckboxAtomView: React.FC<CheckboxAtomViewProps> = ({
  checked, hasError, disabled, className,
  onFocus, onBlur, forwardedRef, ...rest
}) => (
  <input
    ref={forwardedRef}
    type="checkbox"
    checked={checked}
    disabled={disabled}
    onFocus={onFocus}
    onBlur={onBlur}
    className={cn(
      'h-4 w-4 rounded border cursor-pointer',
      'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500',
      'disabled:pointer-events-none disabled:opacity-50',
      hasError
        ? 'border-danger-500 text-danger-500'
        : 'border-neutral-300 text-primary-600',
      className
    )}
    {...rest}
  />
);
