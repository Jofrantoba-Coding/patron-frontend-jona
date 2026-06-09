import React from 'react';
import { InterJRadioButton } from './InterJRadioButton';
type JRadioButtonViewProps = InterJRadioButton & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'onChange' | 'checked' | 'type' | 'disabled' | 'onFocus' | 'onBlur'> & {
    forwardedRef?: React.Ref<HTMLInputElement>;
};
export declare const JRadioButtonView: React.FC<JRadioButtonViewProps>;
export {};
