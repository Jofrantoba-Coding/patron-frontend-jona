// JContactStepsView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { JSectionHeading } from '../../molecules/JSectionHeading/JSectionHeading';
import { JNumberedStep } from '../../molecules/JNumberedStep/JNumberedStep';
import { InterJContactSteps } from './InterJContactSteps';

export const JContactStepsView: React.FC<InterJContactSteps> = ({
  eyebrow,
  heading,
  steps,
  as = 'section',
  className,
}) => {
  const Tag = as;
  return (
    <Tag className={cn('w-full border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20', className)}>
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <JSectionHeading eyebrow={eyebrow} heading={heading} className="mb-10" />
        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <JNumberedStep
              key={step.num}
              num={step.num}
              title={step.title}
              body={step.body}
            />
          ))}
        </div>
      </div>
    </Tag>
  );
};
