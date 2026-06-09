import React from 'react';
import { InterJSpinner } from './InterJSpinner';
type JSpinnerViewProps = InterJSpinner & {
    forwardedRef?: React.Ref<HTMLSpanElement>;
};
export declare const JSpinnerView: React.FC<JSpinnerViewProps>;
export {};
