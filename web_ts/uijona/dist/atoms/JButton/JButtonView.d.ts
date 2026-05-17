import React from 'react';
import type { InterJButton } from './InterJButton';
interface JButtonViewProps extends InterJButton {
    forwardedRef?: React.Ref<HTMLButtonElement>;
    [key: string]: unknown;
}
export declare const JButtonView: React.FC<JButtonViewProps>;
export {};
