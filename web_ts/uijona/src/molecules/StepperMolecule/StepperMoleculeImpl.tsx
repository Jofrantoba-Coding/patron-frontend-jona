import React, { useState } from 'react';
import { InterStepperMolecule, STEPPER_MOLECULE_DEFAULTS } from './InterStepperMolecule';
import { StepperMoleculeView } from './StepperMoleculeView';

export const StepperMoleculeImpl: React.FC<InterStepperMolecule> = ({
  currentStep,
  defaultStep = 0,
  onStepChange,
  ...props
}) => {
  const resolved = { ...STEPPER_MOLECULE_DEFAULTS, ...props };
  const [internalStep, setInternalStep] = useState(defaultStep);
  const activeStep = Math.min(Math.max(currentStep ?? internalStep, 0), Math.max(resolved.steps.length - 1, 0));

  return (
    <StepperMoleculeView
      {...resolved}
      activeStep={activeStep}
      onStepClick={(stepIndex) => {
        const step = resolved.steps[stepIndex];
        if (!step || step.disabled) return;
        if (currentStep === undefined) setInternalStep(stepIndex);
        onStepChange?.(stepIndex, step);
      }}
    />
  );
};

StepperMoleculeImpl.displayName = 'StepperMolecule';
