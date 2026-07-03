// JDetailCTAView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJDetailCTA } from './InterJDetailCTA';

const CTA_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500';

export const JDetailCTAView: React.FC<InterJDetailCTA> = ({
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  as = 'section',
  className,
}) => {
  const Tag = as;
  return (
    <Tag className={cn('w-full bg-neutral-900 py-16 sm:py-20', className)}>
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-prose text-base leading-relaxed text-neutral-400">
            {body}
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <a
              href={primaryHref}
              className={cn(CTA_BASE, 'bg-primary-600 text-white hover:bg-primary-700', 'w-full sm:w-auto')}
            >
              {primaryLabel}
            </a>
            {secondaryHref && secondaryLabel && (
              <a
                href={secondaryHref}
                className={cn(CTA_BASE, 'border border-white/20 text-neutral-200 hover:bg-white/10', 'w-full sm:w-auto')}
              >
                {secondaryLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </Tag>
  );
};
