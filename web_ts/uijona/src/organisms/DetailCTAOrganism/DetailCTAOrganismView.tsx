// DetailCTAOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { LinkAtom } from '../../atoms/LinkAtom/LinkAtom';
import { InterDetailCTAOrganism } from './InterDetailCTAOrganism';

export const DetailCTAOrganismView: React.FC<InterDetailCTAOrganism> = ({
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  as = 'section',
  className,
}) => (
  <PanelAtom
    as={as}
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('detail-section detail-cta-section', className)}
  >
    <PanelAtom variant="ghost" padding="none" radius="none" className="detail-shell">
      <PanelAtom variant="ghost" padding="none" radius="none" className="detail-cta-box">
        <TextAtom as="h2" className="detail-cta-title">{title}</TextAtom>
        <TextAtom className="detail-cta-body">{body}</TextAtom>
        <PanelAtom variant="ghost" padding="none" radius="none" className="detail-cta-actions">
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
    </PanelAtom>
  </PanelAtom>
);
