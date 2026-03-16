// InputAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';

interface InputAtomViewProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown'> {
  hasError?: boolean;
  forwardedRef?: React.Ref<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const InputAtomView: React.FC<InputAtomViewProps> = ({
  hasError = false, className, forwardedRef, onChange, onBlur, onFocus, onKeyDown, ...props
}) => (
  <input
    ref={forwardedRef}
    aria-invalid={hasError || undefined}
    onChange={onChange}
    onBlur={onBlur}
    onFocus={onFocus}
    onKeyDown={onKeyDown}
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
