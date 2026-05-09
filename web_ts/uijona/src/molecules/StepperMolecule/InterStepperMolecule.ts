import React from 'react';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperStepStatus = 'complete' | 'current' | 'upcoming';

export interface StepperStep {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface InterStepperMolecule extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  currentStep?: number;
  defaultStep?: number;
  orientation?: StepperOrientation;
  allowStepClick?: boolean;
  onStepChange?: (stepIndex: number, step: StepperStep) => void;
}

export const STEPPER_MOLECULE_DEFAULTS: Required<Pick<InterStepperMolecule, 'orientation' | 'allowStepClick'>> = {
  orientation: 'horizontal',
  allowStepClick: false,
};
