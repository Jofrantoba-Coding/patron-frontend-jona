// ContactStepsOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
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
  <JPanel
    as={as}
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('contact-steps-section', className)}
  >
    <JPanel variant="ghost" padding="none" radius="none" className="section-shell">
      <SectionHeadingMolecule eyebrow={eyebrow} heading={heading} className="mb-10" />
      <JPanel variant="ghost" padding="none" radius="none" className="contact-steps-list">
        {steps.map((step) => (
          <NumberedStepMolecule
            key={step.num}
            num={step.num}
            title={step.title}
            body={step.body}
          />
        ))}
      </JPanel>
    </JPanel>
  </JPanel>
);
