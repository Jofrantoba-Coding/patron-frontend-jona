import { default as React } from '../../../node_modules/react';
import { InterRadioGroupMolecule, RadioGroupOption } from './InterRadioGroupMolecule';

interface RadioGroupMoleculeViewProps extends InterRadioGroupMolecule {
    selectedValue?: string;
    onOptionChange: (option: RadioGroupOption) => void;
}
export declare const RadioGroupMoleculeView: React.FC<RadioGroupMoleculeViewProps>;
export {};
