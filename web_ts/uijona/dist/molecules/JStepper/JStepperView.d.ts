import React from 'react';
import { InterJStepper } from './InterJStepper';
export type JStepperViewProps = Omit<InterJStepper, 'currentStep' | 'defaultStep' | 'onStepChange'> & {
    activeStep: number;
    onStepClick: (stepIndex: number) => void;
};
export declare const JStepperView: React.FC<JStepperViewProps>;
