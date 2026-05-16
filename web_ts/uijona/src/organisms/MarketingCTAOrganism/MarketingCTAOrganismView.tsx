// MarketingCTAOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { LinkAtom } from '../../atoms/LinkAtom/LinkAtom';
import { InterMarketingCTAOrganism } from './InterMarketingCTAOrganism';

export const MarketingCTAOrganismView: React.FC<InterMarketingCTAOrganism> = ({
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
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('sales-cta-shell', className)}>
    <PanelAtom variant="ghost" padding="none" radius="none">
      <TextAtom as="h2" className="sales-title">{heading}</TextAtom>
      {description && <TextAtom className="sales-copy">{description}</TextAtom>}
    </PanelAtom>
    <PanelAtom variant="ghost" padding="none" radius="none" className="sales-actions">
      {primaryHref ? (
        <LinkAtom href={primaryHref} variant="button" className="sales-link">
          {primaryLabel}
        </LinkAtom>
      ) : (
        <button type="button" onClick={onPrimaryClick} className="sales-link">
          {primaryLabel}
        </button>
      )}
      {secondaryLabel && secondaryHref && (
        <LinkAtom href={secondaryHref} className="sales-link-secondary">
          {secondaryLabel}
        </LinkAtom>
      )}
    </PanelAtom>
  </PanelAtom>
);
