// MarketingHeroOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { LinkAtom } from '../../atoms/LinkAtom/LinkAtom';
import { InterMarketingHeroOrganism, MarketingHeroCTA } from './InterMarketingHeroOrganism';

function renderCTA(cta: MarketingHeroCTA) {
  const className = cta.variant === 'outline' ? 'hero-link-secondary' : 'hero-link-primary';
  if (cta.href) {
    return (
      <LinkAtom key={cta.label} href={cta.href} variant={cta.variant === 'primary' ? 'button' : undefined} className={className}>
        {cta.label}
      </LinkAtom>
    );
  }
  return (
    <button key={cta.label} type="button" onClick={cta.onClick} className={cn('hero-link-primary', className)}>
      {cta.label}
    </button>
  );
}

export const MarketingHeroOrganismView: React.FC<InterMarketingHeroOrganism> = ({
  eyebrow,
  title,
  subtitle,
  ctas,
  visual,
  metrics,
  className,
  ...props
}) => (
  <PanelAtom as="section" variant="ghost" padding="none" radius="none" className={cn('hero-section', className)} {...props}>
    <PanelAtom className="hero-grid" variant="ghost" padding="none" radius="none">
      <PanelAtom className="hero-copy" variant="ghost" padding="none" radius="none">
        {eyebrow && <TextAtom as="span" className="eyebrow">{eyebrow}</TextAtom>}
        <TextAtom as="h1" className="hero-title">{title}</TextAtom>
        {subtitle && <TextAtom className="hero-summary">{subtitle}</TextAtom>}
        {ctas && ctas.length > 0 && (
          <PanelAtom className="hero-actions" variant="ghost" padding="none" radius="none">
            {ctas.map(renderCTA)}
          </PanelAtom>
        )}
        {metrics && (
          <PanelAtom variant="ghost" padding="none" radius="none">{metrics}</PanelAtom>
        )}
      </PanelAtom>
      {visual && (
        <PanelAtom variant="ghost" padding="none" radius="none">{visual}</PanelAtom>
      )}
    </PanelAtom>
  </PanelAtom>
);
