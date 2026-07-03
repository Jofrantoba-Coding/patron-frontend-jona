// JMetricsBandView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJMetricsBand } from './InterJMetricsBand';

export const JMetricsBandView: React.FC<InterJMetricsBand> = ({
  metrics,
  as = 'section',
  id,
  className,
}) => {
  const Tag = as;
  return (
    <Tag id={id} className={cn('w-full border-t border-neutral-800 bg-neutral-900 py-12', className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/5 px-6 py-5"
            >
              <strong className="text-2xl font-black leading-none text-primary-400 sm:text-3xl">
                {m.value}
              </strong>
              <span className="text-sm leading-relaxed text-neutral-400">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Tag>
  );
};
