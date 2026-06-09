// JStepperImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { InterJStepper, JSTEPPER_DEFAULTS } from './InterJStepper';
import { JStepperView } from './JStepperView';

export const JStepperImpl: React.FC<InterJStepper> = ({
  currentStep, defaultStep = 0, onStepChange, ...props
}) => {
  const resolved   = { ...JSTEPPER_DEFAULTS, ...props };
  const [internal, setInternal] = useState(defaultStep);
  const activeStep = Math.min(
    Math.max(currentStep ?? internal, 0),
    Math.max(resolved.steps.length - 1, 0),
  );

  return (
    <JStepperView
      {...resolved}
      activeStep={activeStep}
      onStepClick={(stepIndex) => {
        const step = resolved.steps[stepIndex];
        if (!step || step.disabled) return;
        if (currentStep === undefined) setInternal(stepIndex);
        onStepChange?.(stepIndex, step);
      }}
    />
  );
};

JStepperImpl.displayName = 'JStepper';
