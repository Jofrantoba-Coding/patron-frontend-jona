// ProgressAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterProgressAtom, ProgressVariant } from './InterProgressAtom';
import { JPanel } from '../JPanel/JPanel';

const trackColor: Record<ProgressVariant, string> = {
  default: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-500',
  danger:  'bg-danger-500',
};

export const ProgressAtomView: React.FC<InterProgressAtom> = ({
  value = 0, max = 100, variant = 'default', showLabel, className,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <JPanel variant="ghost" padding="none" radius="none" className={cn('flex items-center gap-2', className)}>
      <JPanel variant="ghost" padding="none" radius="none"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="relative flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden"
      >
        <JPanel variant="ghost" padding="none" radius="none"
          className={cn('h-full rounded-full transition-all duration-300', trackColor[variant])}
          style={{ width: `${pct}%` }}
        />
      </JPanel>
      {showLabel && (
        <span className="text-xs text-neutral-500 tabular-nums w-9 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </JPanel>
  );
};
