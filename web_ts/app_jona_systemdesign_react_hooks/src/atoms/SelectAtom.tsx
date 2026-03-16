// SelectAtom.tsx — Level 1: Atom
// Inspired by shadcn/ui Select — native select with custom styling.
// Supports invalid, disabled, placeholder.
import React from 'react';
import { cn } from '../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectAtomProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  hasError?: boolean;
}

export const SelectAtom = React.forwardRef<HTMLSelectElement, SelectAtomProps>(
  ({ options, groups, placeholder, hasError = false, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(
          'flex h-9 w-full rounded-token-md border bg-neutral-50 px-3 py-1 text-sm text-neutral-900',
          'transition-colors duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // chevron via background image
          'appearance-none bg-no-repeat bg-[right_0.75rem_center]',
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")]',
          'pr-8',
          hasError
            ? 'border-danger-500 focus-visible:ring-danger-500'
            : 'border-neutral-300 focus-visible:ring-primary-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {/* Flat options */}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}

        {/* Grouped options */}
        {groups?.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    );
  }
);

SelectAtom.displayName = 'SelectAtom';
