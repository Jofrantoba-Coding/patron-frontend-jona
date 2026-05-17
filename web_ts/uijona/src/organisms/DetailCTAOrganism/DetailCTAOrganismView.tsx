// DetailCTAOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
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
  <JPanel
    as={as}
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('detail-section detail-cta-section', className)}
  >
    <JPanel variant="ghost" padding="none" radius="none" className="detail-shell">
      <JPanel variant="ghost" padding="none" radius="none" className="detail-cta-box">
        <JLabel as="h2" className="detail-cta-title">{title}</JLabel>
        <JLabel className="detail-cta-body">{body}</JLabel>
        <JPanel variant="ghost" padding="none" radius="none" className="detail-cta-actions">
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
    </JPanel>
  </JPanel>
);
