// JMarketingCTAView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJMarketingCTA } from './InterJMarketingCTA';

export const JMarketingCTAView: React.FC<InterJMarketingCTA> = ({
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
  <JPanel variant="ghost" padding="none" radius="none" className={cn('sales-cta-shell', className)}>
    <JPanel variant="ghost" padding="none" radius="none">
      <JLabel as="h2" className="sales-title">{heading}</JLabel>
      {description && <JLabel className="sales-copy">{description}</JLabel>}
    </JPanel>
    <JPanel variant="ghost" padding="none" radius="none" className="sales-actions">
      {primaryHref ? (
        <JLabel variant="link-button" href={primaryHref} className="sales-link">
          {primaryLabel}
        </JLabel>
      ) : (
        <button type="button" onClick={onPrimaryClick} className="sales-link">
          {primaryLabel}
        </button>
      )}
      {secondaryLabel && secondaryHref && (
        <JLabel variant="link" href={secondaryHref} className="sales-link-secondary">
          {secondaryLabel}
        </JLabel>
      )}
    </JPanel>
  </JPanel>
);
