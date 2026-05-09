import React from 'react';
import { InterStepperMolecule } from './InterStepperMolecule';
type StepperMoleculeViewProps = Omit<InterStepperMolecule, 'currentStep' | 'defaultStep' | 'onStepChange'> & {
    activeStep: number;
    onStepClick: (stepIndex: number) => void;
};
export declare const StepperMoleculeView: React.FC<StepperMoleculeViewProps>;
export {};
