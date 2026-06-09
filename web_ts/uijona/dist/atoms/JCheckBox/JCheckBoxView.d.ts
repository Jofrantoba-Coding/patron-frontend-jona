import React from 'react';
import { InterJCheckBox } from './InterJCheckBox';
interface JCheckBoxViewProps extends InterJCheckBox {
    forwardedRef?: React.Ref<HTMLInputElement>;
}
export declare const JCheckBoxView: React.FC<JCheckBoxViewProps>;
export {};
