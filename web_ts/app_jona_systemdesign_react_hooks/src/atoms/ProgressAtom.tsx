// ProgressAtom.tsx — Level 1: Atom
// Determinate progress bar. Inspired by shadcn/ui Progress.
import React from 'react';
import { cn } from '../lib/cn';

type ProgressVariant = 'default' | 'success' | 'danger' | 'warning';

interface ProgressAtomProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100 */
  value?: number;
  variant?: ProgressVariant;
  /** Show percentage label above bar */
  showLabel?: boolean;
  label?: string;
}

const trackVariant: Record<ProgressVariant, string> = {
  default: 'bg-primary-600',
  success: 'bg-success-500',
  danger:  'bg-danger-500',
  warning: 'bg-yellow-400',
};

export const ProgressAtom: React.FC<ProgressAtomProps> = ({
  value = 0,
  variant = 'default',
  showLabel = false,
  label,
  className,
  ...props
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)} {...props}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-xs font-medium text-neutral-700">{label}</span>}
          {showLabel && (
            <span className="text-xs text-neutral-500 ml-auto">{clamped}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            trackVariant[variant]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
