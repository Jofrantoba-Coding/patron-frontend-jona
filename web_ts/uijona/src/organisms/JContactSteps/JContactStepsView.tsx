// JContactStepsView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JSectionHeading } from '../../molecules/JSectionHeading/JSectionHeading';
import { JNumberedStep } from '../../molecules/JNumberedStep/JNumberedStep';
import { InterJContactSteps } from './InterJContactSteps';

export const JContactStepsView: React.FC<InterJContactSteps> = ({
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
      <JSectionHeading eyebrow={eyebrow} heading={heading} className="mb-10" />
      <JPanel variant="ghost" padding="none" radius="none" className="contact-steps-list">
        {steps.map((step) => (
          <JNumberedStep
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
