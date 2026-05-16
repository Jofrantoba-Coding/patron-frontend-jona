// MetricCardMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { InterMetricCardMolecule, MetricCardTone } from './InterMetricCardMolecule';

const containerClasses: Record<MetricCardTone, string> = {
  dark:  'border-white/10 bg-white/5',
  light: 'border-neutral-200 bg-white shadow-sm',
};

const valueClasses: Record<MetricCardTone, string> = {
  dark:  'text-white',
  light: 'text-neutral-900',
};

const labelClasses: Record<MetricCardTone, string> = {
  dark:  'text-white/60',
  light: 'text-neutral-500',
};

export const MetricCardMoleculeView: React.FC<InterMetricCardMolecule> = ({
  value,
  label,
  tone = 'dark',
  className,
  ...props
}) => (
  <div
    className={cn(
      'min-w-0 rounded-xl border px-5 py-4 text-center',
      containerClasses[tone],
      className
    )}
    {...props}
  >
    <p className={cn('text-3xl font-bold leading-none sm:text-4xl', valueClasses[tone])}>
      {value}
    </p>
    <p className={cn('mt-1.5 text-xs font-medium uppercase tracking-wide', labelClasses[tone])}>
      {label}
    </p>
  </div>
);
