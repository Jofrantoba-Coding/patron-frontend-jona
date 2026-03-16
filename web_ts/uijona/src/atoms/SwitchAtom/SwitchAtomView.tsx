// SwitchAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterSwitchAtom, SwitchSize } from './InterSwitchAtom';

const trackSize: Record<SwitchSize, string> = {
  sm: 'w-8 h-4',
  md: 'w-11 h-6',
  lg: 'w-14 h-7',
};

const thumbSize: Record<SwitchSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const thumbTranslate: Record<SwitchSize, { on: string; off: string }> = {
  sm: { on: 'translate-x-4', off: 'translate-x-0.5' },
  md: { on: 'translate-x-5', off: 'translate-x-0.5' },
  lg: { on: 'translate-x-7', off: 'translate-x-0.5' },
};

interface SwitchAtomViewProps extends InterSwitchAtom {
  id?: string;
  'aria-labelledby'?: string;
  onClick?: () => void;
}

export const SwitchAtomView: React.FC<SwitchAtomViewProps> = ({
  checked, hasError, disabled, size = 'md', className, onClick, id,
  'aria-labelledby': ariaLabelledby,
}) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={ariaLabelledby}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'relative inline-flex items-center rounded-full transition-colors duration-200 cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
      'disabled:pointer-events-none disabled:opacity-50',
      trackSize[size],
      checked
        ? hasError ? 'bg-danger-500' : 'bg-primary-600'
        : hasError ? 'bg-danger-200' : 'bg-neutral-300',
      className
    )}
  >
    <span
      className={cn(
        'inline-block rounded-full bg-white shadow transition-transform duration-200',
      thumbSize[size],
        checked ? thumbTranslate[size].on : thumbTranslate[size].off
      )}
    />
  </button>
);
