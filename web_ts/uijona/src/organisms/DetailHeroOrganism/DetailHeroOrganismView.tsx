// DetailHeroOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { LinkAtom } from '../../atoms/LinkAtom/LinkAtom';
import { InterDetailHeroOrganism } from './InterDetailHeroOrganism';

export const DetailHeroOrganismView: React.FC<InterDetailHeroOrganism> = ({
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
      <LinkAtom href={backHref} className="detail-back">{backLabel}</LinkAtom>
      <JPanel variant="ghost" padding="none" radius="none" className="detail-hero-copy">
        {eyebrow && (
          typeof eyebrow === 'string'
            ? <TextAtom as="span" className="eyebrow">{eyebrow}</TextAtom>
            : <>{eyebrow}</>
        )}
        <TextAtom as="h1" className="detail-title">{title}</TextAtom>
        <TextAtom className="detail-outcome">{outcome}</TextAtom>
        <JPanel variant="ghost" padding="none" radius="none" className="detail-hero-actions">
          <LinkAtom href={primaryHref} variant="button" className="detail-cta-primary">
            {primaryLabel}
          </LinkAtom>
          {secondaryHref && secondaryLabel && (
            <LinkAtom href={secondaryHref} className="detail-cta-secondary">
              {secondaryLabel}
            </LinkAtom>
          )}
        </JPanel>
      </JPanel>
      {visual}
    </JPanel>
  </JPanel>
);
