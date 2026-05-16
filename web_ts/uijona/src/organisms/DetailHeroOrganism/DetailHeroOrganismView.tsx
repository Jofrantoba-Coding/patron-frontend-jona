// DetailHeroOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
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
  <PanelAtom
    as="section"
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('detail-hero', className)}
  >
    <PanelAtom variant="ghost" padding="none" radius="none" className="detail-hero-inner">
      <LinkAtom href={backHref} className="detail-back">{backLabel}</LinkAtom>
      <PanelAtom variant="ghost" padding="none" radius="none" className="detail-hero-copy">
        {eyebrow && (
          typeof eyebrow === 'string'
            ? <TextAtom as="span" className="eyebrow">{eyebrow}</TextAtom>
            : <>{eyebrow}</>
        )}
        <TextAtom as="h1" className="detail-title">{title}</TextAtom>
        <TextAtom className="detail-outcome">{outcome}</TextAtom>
        <PanelAtom variant="ghost" padding="none" radius="none" className="detail-hero-actions">
          <LinkAtom href={primaryHref} variant="button" className="detail-cta-primary">
            {primaryLabel}
          </LinkAtom>
          {secondaryHref && secondaryLabel && (
            <LinkAtom href={secondaryHref} className="detail-cta-secondary">
              {secondaryLabel}
            </LinkAtom>
          )}
        </PanelAtom>
      </PanelAtom>
      {visual}
    </PanelAtom>
  </PanelAtom>
);
