// MarketingHeroOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterMarketingHeroOrganism, MarketingHeroCTA } from './InterMarketingHeroOrganism';

function renderCTA(cta: MarketingHeroCTA) {
  const className = cta.variant === 'outline' ? 'hero-link-secondary' : 'hero-link-primary';
  if (cta.href) {
    return (
      <JLabel variant={cta.variant === 'primary' ? 'link-button' : 'link'} key={cta.label} href={cta.href} className={className}>
        {cta.label}
      </JLabel>
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
  <JPanel as="section" variant="ghost" padding="none" radius="none" className={cn('hero-section', className)} {...props}>
    <JPanel className="hero-grid" variant="ghost" padding="none" radius="none">
      <JPanel className="hero-copy" variant="ghost" padding="none" radius="none">
        {eyebrow && <JLabel as="span" className="eyebrow">{eyebrow}</JLabel>}
        <JLabel as="h1" className="hero-title">{title}</JLabel>
        {subtitle && <JLabel className="hero-summary">{subtitle}</JLabel>}
        {ctas && ctas.length > 0 && (
          <JPanel className="hero-actions" variant="ghost" padding="none" radius="none">
            {ctas.map(renderCTA)}
          </JPanel>
        )}
        {metrics && (
          <JPanel variant="ghost" padding="none" radius="none">{metrics}</JPanel>
        )}
      </JPanel>
      {visual && (
        <JPanel variant="ghost" padding="none" radius="none">{visual}</JPanel>
      )}
    </JPanel>
  </JPanel>
);
