import React from 'react';
import { cn } from '../lib/cn';
import { InterEventsInputAtom } from './events/InterEventsInputAtom';

interface InputAtomProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown'>,
    InterEventsInputAtom {
  hasError?: boolean;
}

export const InputAtom = React.forwardRef<HTMLInputElement, InputAtomProps>(
  ({ hasError = false, className, onChange, onBlur, onFocus, onKeyDown, onEnterPress, onClear, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value, e);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => onBlur?.(e.target.value, e);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onEnterPress?.((e.target as HTMLInputElement).value, e);
      if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') onClear?.();
      onKeyDown?.(e);
    };

    return (
      <input
        ref={ref}
        aria-invalid={hasError || undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex h-9 w-full rounded-md border bg-neutral-50 px-3 py-1 text-sm text-neutral-900',
          'placeholder:text-neutral-400 transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError
            ? 'border-danger-500 focus-visible:ring-danger-500'
            : 'border-neutral-300 focus-visible:ring-primary-500',
          className
        )}
        {...props}
      />
    );
  }
);

InputAtom.displayName = 'InputAtom';
