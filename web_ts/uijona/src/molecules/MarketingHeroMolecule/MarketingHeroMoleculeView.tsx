// MarketingHeroMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { EyebrowAtom } from '../../atoms/EyebrowAtom/EyebrowAtom';
import { SectionShellAtom } from '../../atoms/SectionShellAtom/SectionShellAtom';
import { InterMarketingHeroMolecule, MarketingHeroCTA } from './InterMarketingHeroMolecule';

const ctaBaseClasses =
  'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200';

const ctaVariantClasses: Record<NonNullable<MarketingHeroCTA['variant']>, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  outline: 'border border-white/30 text-white hover:bg-white/10',
};

export const MarketingHeroMoleculeView: React.FC<InterMarketingHeroMolecule> = ({
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
    className={cn(
      'relative overflow-hidden bg-neutral-900 py-20 sm:py-28',
      className
    )}
    {...props}
  >
    <SectionShellAtom>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Copy column */}
        <div className="flex flex-col gap-6">
          {eyebrow && <EyebrowAtom variant="white">{eyebrow}</EyebrowAtom>}
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
              {subtitle}
            </p>
          )}
          {ctas && ctas.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {ctas.map((cta) => (
                cta.href ? (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={cn(ctaBaseClasses, ctaVariantClasses[cta.variant ?? 'primary'])}
                  >
                    {cta.label}
                  </a>
                ) : (
                  <button
                    key={cta.label}
                    type="button"
                    onClick={cta.onClick}
                    className={cn(ctaBaseClasses, ctaVariantClasses[cta.variant ?? 'primary'])}
                  >
                    {cta.label}
                  </button>
                )
              ))}
            </div>
          )}
          {metrics && <div className="pt-2">{metrics}</div>}
        </div>

        {/* Visual column */}
        {visual && (
          <div className="flex items-center justify-center lg:justify-end">
            {visual}
          </div>
        )}
      </div>
    </SectionShellAtom>
  </section>
);
