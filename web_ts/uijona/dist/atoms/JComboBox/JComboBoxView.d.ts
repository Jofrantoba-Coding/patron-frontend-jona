import React from 'react';
import { InterJComboBox } from './InterJComboBox';
interface JComboBoxViewProps extends InterJComboBox {
    forwardedRef?: React.Ref<HTMLSelectElement>;
}
export declare const JComboBoxView: React.FC<JComboBoxViewProps>;
export {};
