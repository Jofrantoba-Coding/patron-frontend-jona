// JDetailHeroView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJDetailHero } from './InterJDetailHero';

const CTA_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500';

export const JDetailHeroView: React.FC<InterJDetailHero> = ({
  backHref,
  backLabel,
  eyebrow,
  title,
  outcome,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  visual,
  className,
}) => (
  <section className={cn('w-full bg-neutral-900 py-14 sm:py-16', className)}>
    <div
      className={cn(
        'mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6',
        visual && 'md:grid-cols-[1fr_auto] md:items-center md:gap-12',
      )}
    >
      <a
        href={backHref}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:col-span-full"
      >
        {backLabel}
      </a>

      <div className="min-w-0 max-w-2xl">
        {eyebrow != null && (
          typeof eyebrow === 'string'
            ? <span className="text-xs font-semibold uppercase tracking-wide text-primary-400">{eyebrow}</span>
            : eyebrow
        )}
        <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
          {outcome}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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

      {visual && <div className="min-w-0">{visual}</div>}
    </div>
  </section>
);
