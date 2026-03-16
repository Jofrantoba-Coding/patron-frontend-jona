// InputAtom.tsx — Level 1: Atom
// Inspired by shadcn/ui Input — supports invalid, disabled, required states.
import React from 'react';
import { cn } from '../lib/cn';

interface InputAtomProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const InputAtom = React.forwardRef<HTMLInputElement, InputAtomProps>(
  ({ hasError = false, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(
          'flex h-9 w-full rounded-token-md border bg-neutral-50 px-3 py-1 text-sm text-neutral-900',
          'placeholder:text-neutral-400',
          'transition-colors duration-200',
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
