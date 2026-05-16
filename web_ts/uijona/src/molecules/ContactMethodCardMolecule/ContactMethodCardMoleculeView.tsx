// ContactMethodCardMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { LinkAtom } from '../../atoms/LinkAtom/LinkAtom';
import { InterContactMethodCardMolecule } from './InterContactMethodCardMolecule';

export const ContactMethodCardMoleculeView: React.FC<InterContactMethodCardMolecule> = ({
  icon,
  label,
  description,
  href,
  actionLabel,
  isPrimary,
  className,
}) => (
  <PanelAtom
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('contact-method-card', isPrimary && 'primary', className)}
  >
    <TextAtom as="span" className="contact-method-icon" aria-hidden="true">{icon}</TextAtom>
    <TextAtom as="strong" className="contact-method-label">{label}</TextAtom>
    <TextAtom className="contact-method-desc">{description}</TextAtom>
    {actionLabel ? (
      <LinkAtom href={href} variant="button" className="contact-method-cta">
        {actionLabel}
      </LinkAtom>
    ) : (
      <LinkAtom href={href} className="contact-method-link">
        {href}
      </LinkAtom>
    )}
  </PanelAtom>
);
