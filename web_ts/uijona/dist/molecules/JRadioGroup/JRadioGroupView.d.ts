import React from 'react';
import { InterJRadioGroup, JRadioGroupOption } from './InterJRadioGroup';
interface JRadioGroupViewProps extends InterJRadioGroup {
    selectedValue?: string;
    onOptionChange: (option: JRadioGroupOption) => void;
}
export declare const JRadioGroupView: React.FC<JRadioGroupViewProps>;
export {};
