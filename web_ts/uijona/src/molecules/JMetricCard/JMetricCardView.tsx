// JMetricCardView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJMetricCard } from './InterJMetricCard';

export const JMetricCardView: React.FC<InterJMetricCard> = ({
  value,
  label,
  className,
}) => (
  <div
    className={cn(
      'flex min-w-0 flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-5',
      className,
    )}
  >
    <strong className="text-2xl font-black leading-none text-neutral-900 sm:text-3xl">
      {value}
    </strong>
    <span className="text-sm leading-relaxed text-neutral-500">{label}</span>
  </div>
);
