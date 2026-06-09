// JServiceCardView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJServiceCard } from './InterJServiceCard';

export const JServiceCardView: React.FC<InterJServiceCard> = ({
  icon,
  title,
  description,
  proof,
  href,
  className,
}) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('service-card business-card', className)}>
    <JPanel className="card-area-header" variant="ghost" padding="none" radius="none">
      {icon && (
        <JLabel as="span" className="service-icon-emoji" aria-hidden="true">{icon}</JLabel>
      )}
      <JLabel as="h3" className="card-title">{title}</JLabel>
      <JLabel className="card-description">{description}</JLabel>
    </JPanel>
    {proof && (
      <JPanel className="card-area-content" variant="ghost" padding="none" radius="none">
        <JLabel className="business-proof">{proof}</JLabel>
      </JPanel>
    )}
    {href && (
      <JPanel className="card-area-footer" variant="ghost" padding="none" radius="none">
        <JLabel variant="link" href={href} className="card-detail-link">Ver servicio →</JLabel>
      </JPanel>
    )}
  </JPanel>
);
