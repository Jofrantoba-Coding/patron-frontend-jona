// SwitchAtom.tsx — Level 1: Atom
// Toggle switch control. Inspired by shadcn/ui Switch.
// Supports sm/md/lg sizes, disabled, invalid states.
import React from 'react';
import { cn } from '../lib/cn';

type SwitchSize = 'sm' | 'md' | 'lg';

interface SwitchAtomProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  hasError?: boolean;
  size?: SwitchSize;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const sizeMap: Record<SwitchSize, { track: string; thumb: string; translate: string }> = {
  sm: { track: 'h-4 w-7',  thumb: 'h-3 w-3',  translate: 'translate-x-3' },
  md: { track: 'h-5 w-9',  thumb: 'h-4 w-4',  translate: 'translate-x-4' },
  lg: { track: 'h-6 w-11', thumb: 'h-5 w-5',  translate: 'translate-x-5' },
};

export const SwitchAtom: React.FC<SwitchAtomProps> = ({
  id,
  checked = false,
  onCheckedChange,
  disabled = false,
  hasError = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const { track, thumb, translate } = sizeMap[size];

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-invalid={hasError || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked
          ? hasError ? 'bg-danger-500' : 'bg-primary-600'
          : 'bg-neutral-300',
        track,
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow-sm',
          'transition-transform duration-200',
          checked ? translate : 'translate-x-0',
          thumb
        )}
      />
    </button>
  );
};
