export type JStepperOrientation = 'horizontal' | 'vertical';
export type JStepperStepStatus = 'complete' | 'current' | 'upcoming';

export interface JStepperStep {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

/** Contrato publico de JStepper. */
export interface InterJStepper {
  steps: JStepperStep[];
  currentStep?: number;
  orientation?: JStepperOrientation;
  allowStepClick?: boolean;
}
