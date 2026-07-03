// JMarketingCTAView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJMarketingCTA } from './InterJMarketingCTA';

const LINK_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500';

export const JMarketingCTAView: React.FC<InterJMarketingCTA> = ({
  heading,
  description,
  primaryLabel,
  primaryHref,
  onPrimaryClick,
  secondaryLabel,
  secondaryHref,
  onSecondaryClick,
  className,
}) => (
  <section className={cn('w-full px-4 py-16 sm:px-6 sm:py-20', className)}>
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-12">
      <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
        {heading}
      </h2>
      {description && (
        <p className="max-w-prose text-base leading-relaxed text-neutral-600">
          {description}
        </p>
      )}
      <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
        {primaryHref ? (
          <a
            href={primaryHref}
            className={cn(LINK_BASE, 'bg-primary-600 text-white hover:bg-primary-700', 'w-full sm:w-auto')}
          >
            {primaryLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onPrimaryClick}
            className={cn(LINK_BASE, 'bg-primary-600 text-white hover:bg-primary-700', 'w-full sm:w-auto')}
          >
            {primaryLabel}
          </button>
        )}

        {secondaryLabel && (secondaryHref || onSecondaryClick) && (
          secondaryHref ? (
            <a
              href={secondaryHref}
              className={cn(LINK_BASE, 'border border-neutral-300 text-neutral-900 hover:bg-neutral-100', 'w-full sm:w-auto')}
            >
              {secondaryLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={onSecondaryClick}
              className={cn(LINK_BASE, 'border border-neutral-300 text-neutral-900 hover:bg-neutral-100', 'w-full sm:w-auto')}
            >
              {secondaryLabel}
            </button>
          )
        )}
      </div>
    </div>
  </section>
);
