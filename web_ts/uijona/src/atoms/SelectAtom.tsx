import React from 'react';
import { cn } from '../lib/cn';
import { InterEventsSelectAtom } from './events/InterEventsSelectAtom';

export interface SelectOption { value: string; label: string; disabled?: boolean; }
export interface SelectGroup { label: string; options: SelectOption[]; }

interface SelectAtomProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur'>,
    InterEventsSelectAtom {
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  hasError?: boolean;
}

export const SelectAtom = React.forwardRef<HTMLSelectElement, SelectAtomProps>(
  ({ options, groups, placeholder, hasError = false, className, onChange, onBlur, onFocus, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={hasError || undefined}
      onChange={(e) => onChange?.(e.target.value, e)}
      onBlur={(e) => onBlur?.(e.target.value, e)}
      onFocus={onFocus}
      className={cn(
        'flex h-9 w-full rounded-md border bg-neutral-50 px-3 py-1 text-sm text-neutral-900',
        'transition-colors duration-200 cursor-pointer appearance-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-50',
        hasError ? 'border-danger-500 focus-visible:ring-danger-500' : 'border-neutral-300 focus-visible:ring-primary-500',
        className
      )}
      {...props}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options?.map((opt) => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
      {groups?.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((opt) => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
        </optgroup>
      ))}
    </select>
  )
);

SelectAtom.displayName = 'SelectAtom';
