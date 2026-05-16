// ServiceCardMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { LinkAtom } from '../../atoms/LinkAtom/LinkAtom';
import { InterServiceCardMolecule } from './InterServiceCardMolecule';

export const ServiceCardMoleculeView: React.FC<InterServiceCardMolecule> = ({
  icon,
  title,
  description,
  proof,
  href,
  className,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('service-card business-card', className)}>
    <PanelAtom className="card-area-header" variant="ghost" padding="none" radius="none">
      {icon && (
        <TextAtom as="span" className="service-icon-emoji" aria-hidden="true">{icon}</TextAtom>
      )}
      <TextAtom as="h3" className="card-title">{title}</TextAtom>
      <TextAtom className="card-description">{description}</TextAtom>
    </PanelAtom>
    {proof && (
      <PanelAtom className="card-area-content" variant="ghost" padding="none" radius="none">
        <TextAtom className="business-proof">{proof}</TextAtom>
      </PanelAtom>
    )}
    {href && (
      <PanelAtom className="card-area-footer" variant="ghost" padding="none" radius="none">
        <LinkAtom href={href} className="card-detail-link">Ver servicio →</LinkAtom>
      </PanelAtom>
    )}
  </PanelAtom>
);
