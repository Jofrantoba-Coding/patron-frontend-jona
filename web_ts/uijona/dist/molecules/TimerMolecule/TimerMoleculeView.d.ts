import React from 'react';
import { InterTimerMolecule, TimerMoleculeFormatContext, TimerMoleculeStatus } from './InterTimerMolecule';
interface TimerMoleculeViewProps extends InterTimerMolecule {
    status: TimerMoleculeStatus;
    context: TimerMoleculeFormatContext;
    displayValue: React.ReactNode;
    canStart: boolean;
    canPause: boolean;
    canResume: boolean;
    onStartClick: () => void;
    onPauseClick: () => void;
    onResumeClick: () => void;
    onResetClick: () => void;
}
export declare const TimerMoleculeView: React.FC<TimerMoleculeViewProps>;
export {};
