// JDetailHeroView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJDetailHero } from './InterJDetailHero';

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
  <JPanel
    as="section"
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('detail-hero', className)}
  >
    <JPanel variant="ghost" padding="none" radius="none" className="detail-hero-inner">
      <JLabel variant="link" href={backHref} className="detail-back">{backLabel}</JLabel>
      <JPanel variant="ghost" padding="none" radius="none" className="detail-hero-copy">
        {eyebrow && (
          typeof eyebrow === 'string'
            ? <JLabel as="span" className="eyebrow">{eyebrow}</JLabel>
            : <>{eyebrow}</>
        )}
        <JLabel as="h1" className="detail-title">{title}</JLabel>
        <JLabel className="detail-outcome">{outcome}</JLabel>
        <JPanel variant="ghost" padding="none" radius="none" className="detail-hero-actions">
          <JLabel variant="link-button" href={primaryHref} className="detail-cta-primary">
            {primaryLabel}
          </JLabel>
          {secondaryHref && secondaryLabel && (
            <JLabel variant="link" href={secondaryHref} className="detail-cta-secondary">
              {secondaryLabel}
            </JLabel>
          )}
        </JPanel>
      </JPanel>
      {visual}
    </JPanel>
  </JPanel>
);
