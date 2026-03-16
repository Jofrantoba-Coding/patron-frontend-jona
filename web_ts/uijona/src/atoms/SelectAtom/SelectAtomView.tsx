// SelectAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterSelectAtom } from './InterSelectAtom';

interface SelectAtomViewProps {
  options?: InterSelectAtom['options'];
  groups?: InterSelectAtom['groups'];
  placeholder?: string;
  hasError?: boolean;
  className?: string;
  forwardedRef?: React.Ref<HTMLSelectElement>;
  value?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-describedby'?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

export const SelectAtomView: React.FC<SelectAtomViewProps> = ({
  options, groups, placeholder, hasError = false, className,
  forwardedRef, onChange, onFocus, onBlur, ...rest
}) => (
  <select
    ref={forwardedRef}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    aria-invalid={hasError || undefined}
    className={cn(
      'flex h-9 w-full rounded-md border bg-white px-3 py-1 text-sm',
      'transition-colors duration-150 cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      'disabled:pointer-events-none disabled:opacity-50',
      hasError
        ? 'border-danger-500 focus-visible:ring-danger-500'
        : 'border-neutral-300 focus-visible:ring-primary-500',
      className
    )}
    {...rest}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {groups
      ? groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
            ))}
          </optgroup>
        ))
      : options?.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
  </select>
);
