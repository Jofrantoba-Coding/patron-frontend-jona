// ContactStepsOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { SectionHeadingMolecule } from '../../molecules/SectionHeadingMolecule/SectionHeadingMolecule';
import { NumberedStepMolecule } from '../../molecules/NumberedStepMolecule/NumberedStepMolecule';
import { InterContactStepsOrganism } from './InterContactStepsOrganism';

export const ContactStepsOrganismView: React.FC<InterContactStepsOrganism> = ({
  eyebrow,
  heading,
  steps,
  as = 'section',
  className,
}) => (
  <PanelAtom
    as={as}
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('contact-steps-section', className)}
  >
    <PanelAtom variant="ghost" padding="none" radius="none" className="section-shell">
      <SectionHeadingMolecule eyebrow={eyebrow} heading={heading} className="mb-10" />
      <PanelAtom variant="ghost" padding="none" radius="none" className="contact-steps-list">
        {steps.map((step) => (
          <NumberedStepMolecule
            key={step.num}
            num={step.num}
            title={step.title}
            body={step.body}
          />
        ))}
      </PanelAtom>
    </PanelAtom>
  </PanelAtom>
);
