import React from 'react';
import { InterJTimer, JTimerFormatContext, JTimerStatus } from './InterJTimer';
interface JTimerViewProps extends InterJTimer {
    status: JTimerStatus;
    context: JTimerFormatContext;
    displayValue: React.ReactNode;
    canStart: boolean;
    canPause: boolean;
    canResume: boolean;
    onStartClick: () => void;
    onPauseClick: () => void;
    onResumeClick: () => void;
    onResetClick: () => void;
}
export declare const JTimerView: React.FC<JTimerViewProps>;
export {};
