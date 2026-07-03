// JHeroDynamicView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJHeroDynamic, HeroDynamicCTA } from './InterJHeroDynamic';

const CTA_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500';

const CTA_VARIANT = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  outline: 'border border-white/20 text-neutral-200 hover:bg-white/10',
} as const;

function renderCTA(cta: HeroDynamicCTA) {
  const variant = cta.variant ?? 'primary';
  const className = cn(CTA_BASE, CTA_VARIANT[variant], 'w-full sm:w-auto');
  if (cta.href) {
    return <a key={cta.label} href={cta.href} className={className}>{cta.label}</a>;
  }
  return <button key={cta.label} type="button" onClick={cta.onClick} className={className}>{cta.label}</button>;
}

// Props que inyecta el Impl: sustituye `rotatingWords` por la palabra activa.
type JHeroDynamicViewProps = Omit<InterJHeroDynamic, 'rotatingWords' | 'intervalMs'> & {
  word: string;
};

export const JHeroDynamicView: React.FC<JHeroDynamicViewProps> = ({
  eyebrow,
  titlePrefix,
  word,
  subtitle,
  ctas,
  visual,
  className,
  ...props
}) => (
  <section
    className={cn('w-full bg-neutral-900 px-4 py-16 sm:px-6 sm:py-20 lg:py-28', className)}
    {...props}
  >
    <div
      className={cn(
        'mx-auto grid w-full max-w-6xl gap-10',
        visual && 'lg:grid-cols-2 lg:items-center lg:gap-16',
      )}
    >
      <div className="flex min-w-0 flex-col gap-5">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-400">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {titlePrefix}{' '}
          {/* Región viva: el lector de pantalla anuncia cada vertical al cambiar */}
          <span aria-live="polite" className="inline-block">
            <span key={word} className="jhero-word bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              {word}
            </span>
          </span>
        </h1>
        {subtitle && (
          <p className="max-w-prose text-base leading-relaxed text-neutral-400 sm:text-lg">
            {subtitle}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {ctas.map(renderCTA)}
          </div>
        )}
      </div>
      {visual && <div className="min-w-0">{visual}</div>}
    </div>
  </section>
);
