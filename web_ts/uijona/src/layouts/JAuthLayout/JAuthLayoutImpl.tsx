// JAuthLayoutImpl.tsx — JONA Implementation
import React from 'react';
import { InterJAuthLayout } from './InterJAuthLayout';
import { JAuthLayoutView } from './JAuthLayoutView';

/** A frame only: it renders the host's form as children and adds no handler of its own. */
export const JAuthLayoutImpl: React.FC<InterJAuthLayout> = ({
  brand, steps, currentStep, title, description, children, footer,
}) => (
  <JAuthLayoutView
    brand={brand}
    steps={steps}
    stepIndex={steps?.findIndex((step) => step.id === currentStep) ?? -1}
    title={title}
    description={description}
    footer={footer}
  >
    {children}
  </JAuthLayoutView>
);

JAuthLayoutImpl.displayName = 'JAuthLayout';
