import React from 'react';
import { InterRadioGroupMolecule, RadioGroupOption } from './InterRadioGroupMolecule';
interface RadioGroupMoleculeViewProps extends InterRadioGroupMolecule {
    selectedValue?: string;
    onOptionChange: (option: RadioGroupOption) => void;
}
export declare const RadioGroupMoleculeView: React.FC<RadioGroupMoleculeViewProps>;
export {};
