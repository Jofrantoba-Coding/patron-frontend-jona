import React from 'react';
export type JStepperOrientation = 'horizontal' | 'vertical';
export type JStepperStepStatus = 'complete' | 'current' | 'upcoming';
export interface JStepperStep {
    id: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
}
export interface InterJStepper extends React.HTMLAttributes<HTMLOListElement> {
    steps: JStepperStep[];
    currentStep?: number;
    defaultStep?: number;
    orientation?: JStepperOrientation;
    allowStepClick?: boolean;
    onStepChange?: (stepIndex: number, step: JStepperStep) => void;
}
export declare const JSTEPPER_DEFAULTS: Required<Pick<InterJStepper, 'orientation' | 'allowStepClick'>>;
