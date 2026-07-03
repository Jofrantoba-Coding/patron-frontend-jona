// JSectionHeadingView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJSectionHeading } from './InterJSectionHeading';

export const JSectionHeadingView: React.FC<InterJSectionHeading> = ({
  eyebrow,
  heading,
  description,
  className,
}) => (
  <div className={cn('flex min-w-0 flex-col gap-2', className)}>
    {eyebrow && (
      <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
        {eyebrow}
      </span>
    )}
    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
      {heading}
    </h2>
    {description && (
      <p className="max-w-prose text-base leading-relaxed text-neutral-600">
        {description}
      </p>
    )}
  </div>
);
