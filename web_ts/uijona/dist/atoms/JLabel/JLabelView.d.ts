import React from 'react';
import { InterJLabel } from './InterJLabel';
interface JLabelViewProps extends InterJLabel {
    forwardedRef?: React.Ref<HTMLElement>;
}
export declare const JLabelView: React.FC<JLabelViewProps>;
export {};
