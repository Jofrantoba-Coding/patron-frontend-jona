// JNumberedStepView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJNumberedStep } from './InterJNumberedStep';

export const JNumberedStepView: React.FC<InterJNumberedStep> = ({
  num,
  title,
  body,
  className,
}) => (
  <div
    className={cn(
      'flex items-start gap-5 rounded-xl border border-neutral-200 bg-white p-6',
      className,
    )}
  >
    <span className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary-200 bg-primary-50 text-sm font-black text-primary-700">
      {num}
    </span>
    <div className="flex min-w-0 flex-col gap-1.5">
      <strong className="text-base font-bold text-neutral-900">{title}</strong>
      <p className="text-sm leading-relaxed text-neutral-500">{body}</p>
    </div>
  </div>
);
