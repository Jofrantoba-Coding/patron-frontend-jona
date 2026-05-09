// ChipAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterChipAtom, ChipVariant } from './InterChipAtom';

const variantClasses: Record<ChipVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-green-50 text-success-600 border-green-200',
  warning: 'bg-yellow-50 text-warning-600 border-yellow-200',
  danger: 'bg-red-50 text-danger-600 border-red-200',
};

export const ChipAtomView: React.FC<InterChipAtom> = ({
  variant = 'default', selected, removable, onRemove, className, children, ...props
}) => (
  <span
    data-selected={selected || undefined}
    className={cn(
      'inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium',
      'data-[selected=true]:ring-2 data-[selected=true]:ring-primary-500 data-[selected=true]:ring-offset-1',
      variantClasses[variant],
      className
    )}
    {...props}
  >
    {children}
    {removable && (
      <button
        type="button"
        aria-label="Remove"
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        onClick={onRemove}
      >
        ×
      </button>
    )}
  </span>
);
