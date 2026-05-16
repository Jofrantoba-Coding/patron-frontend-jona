// ContactMethodsOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { GridLayout } from '../../layouts/GridLayout';
import { ContactMethodCardMolecule } from '../../molecules/ContactMethodCardMolecule/ContactMethodCardMolecule';
import { InterContactMethodsOrganism } from './InterContactMethodsOrganism';

export const ContactMethodsOrganismView: React.FC<InterContactMethodsOrganism> = ({
  methods,
  as = 'section',
  className,
}) => (
  <PanelAtom
    as={as}
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('contact-methods-section', className)}
  >
    <PanelAtom variant="ghost" padding="none" radius="none" className="section-shell">
      <GridLayout autoFitMin="260px" className="contact-methods-grid">
        {methods.map((method) => (
          <ContactMethodCardMolecule
            key={method.label}
            icon={method.icon}
            label={method.label}
            description={method.description}
            href={method.href}
            actionLabel={method.actionLabel}
            isPrimary={method.isPrimary}
          />
        ))}
      </GridLayout>
    </PanelAtom>
  </PanelAtom>
);
