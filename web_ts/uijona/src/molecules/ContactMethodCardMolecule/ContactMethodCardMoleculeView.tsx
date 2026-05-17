// ContactMethodCardMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
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
  <JPanel
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('contact-method-card', isPrimary && 'primary', className)}
  >
    <JLabel as="span" className="contact-method-icon" aria-hidden="true">{icon}</JLabel>
    <JLabel as="strong" className="contact-method-label">{label}</JLabel>
    <JLabel className="contact-method-desc">{description}</JLabel>
    {actionLabel ? (
      <JLabel variant="link-button" href={href} className="contact-method-cta">
        {actionLabel}
      </JLabel>
    ) : (
      <JLabel variant="link" href={href} className="contact-method-link">
        {href}
      </JLabel>
    )}
  </JPanel>
);
