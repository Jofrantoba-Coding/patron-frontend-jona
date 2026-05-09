import React from 'react';
import { cn } from '../../lib/cn';
import { InterStatCardMolecule, StatCardTone, StatCardTrend } from './InterStatCardMolecule';

const toneClasses: Record<StatCardTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-600',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  info: 'bg-primary-50 text-primary-700',
};

const trendClasses: Record<StatCardTrend, string> = {
  up: 'text-success-700',
  down: 'text-danger-700',
  flat: 'text-neutral-500',
};

export const StatCardMoleculeView: React.FC<InterStatCardMolecule> = ({
  label,
  value,
  description,
  icon,
  tone = 'neutral',
  trend = 'flat',
  trendLabel,
  className,
  ...props
}) => (
  <div className={cn('min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5', className)} {...props}>
    <div className="flex min-w-0 items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="break-words text-sm font-medium text-neutral-500">{label}</p>
        <p className="mt-1 break-words text-2xl font-semibold leading-tight text-neutral-900">{value}</p>
      </div>
      {icon && <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-md', toneClasses[tone])}>{icon}</div>}
    </div>
    {(description || trendLabel) && (
      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {trendLabel && <span className={cn('font-medium', trendClasses[trend])}>{trendLabel}</span>}
        {description && <span className="break-words text-neutral-500">{description}</span>}
      </div>
    )}
  </div>
);
