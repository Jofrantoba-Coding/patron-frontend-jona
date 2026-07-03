// JMarketingHeroView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJMarketingHero, MarketingHeroCTA } from './InterJMarketingHero';

const CTA_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500';

const CTA_VARIANT = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  outline: 'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100',
} as const;

function renderCTA(cta: MarketingHeroCTA) {
  const variant = cta.variant ?? 'primary';
  const className = cn(CTA_BASE, CTA_VARIANT[variant], 'w-full sm:w-auto');

  if (cta.href) {
    return (
      <a key={cta.label} href={cta.href} className={className}>
        {cta.label}
      </a>
    );
  }
  return (
    <button key={cta.label} type="button" onClick={cta.onClick} className={className}>
      {cta.label}
    </button>
  );
}

export const JMarketingHeroView: React.FC<InterJMarketingHero> = ({
  eyebrow,
  title,
  subtitle,
  ctas,
  visual,
  metrics,
  className,
  ...props
}) => (
  <section
    className={cn('w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-24', className)}
    {...props}
  >
    <div
      className={cn(
        'mx-auto grid w-full max-w-6xl gap-10',
        // Apila en móvil; dos columnas desde lg
        visual && 'lg:grid-cols-2 lg:items-center lg:gap-16',
      )}
    >
      {/* Copy */}
      <div className="flex min-w-0 flex-col gap-5">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-prose text-base leading-relaxed text-neutral-600 sm:text-lg">
            {subtitle}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {ctas.map(renderCTA)}
          </div>
        )}
        {metrics && <div className="mt-2">{metrics}</div>}
      </div>

      {/* Visual */}
      {visual && <div className="min-w-0">{visual}</div>}
    </div>
  </section>
);
