// ServiceCardMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
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
  <JPanel variant="ghost" padding="none" radius="none" className={cn('service-card business-card', className)}>
    <JPanel className="card-area-header" variant="ghost" padding="none" radius="none">
      {icon && (
        <TextAtom as="span" className="service-icon-emoji" aria-hidden="true">{icon}</TextAtom>
      )}
      <TextAtom as="h3" className="card-title">{title}</TextAtom>
      <TextAtom className="card-description">{description}</TextAtom>
    </JPanel>
    {proof && (
      <JPanel className="card-area-content" variant="ghost" padding="none" radius="none">
        <TextAtom className="business-proof">{proof}</TextAtom>
      </JPanel>
    )}
    {href && (
      <JPanel className="card-area-footer" variant="ghost" padding="none" radius="none">
        <LinkAtom href={href} className="card-detail-link">Ver servicio →</LinkAtom>
      </JPanel>
    )}
  </JPanel>
);
