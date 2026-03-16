import React from 'react';
import { cn } from '../lib/cn';
import { InterEventsCheckboxAtom } from './events/InterEventsCheckboxAtom';

interface CheckboxAtomProps extends InterEventsCheckboxAtom {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const CheckboxAtom: React.FC<CheckboxAtomProps> = ({
  id, checked = false, onCheckedChange, onFocus, onBlur,
  disabled = false, hasError = false, className, 'aria-label': ariaLabel,
}) => (
  <button
    id={id}
    role="checkbox"
    type="button"
    aria-checked={checked}
    aria-invalid={hasError || undefined}
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={() => !disabled && onCheckedChange?.(!checked)}
    onFocus={onFocus}
    onBlur={onBlur}
    className={cn(
      'h-4 w-4 shrink-0 rounded-sm border transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-neutral-300',
      hasError && 'border-danger-500',
      className
    )}
  >
    {checked && (
      <svg className="h-3 w-3 mx-auto text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="2,6 5,9 10,3" />
      </svg>
    )}
  </button>
);
