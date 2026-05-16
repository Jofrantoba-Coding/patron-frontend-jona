import React from 'react';
import { InterSelectFieldMolecule } from './InterSelectFieldMolecule';
type SelectFieldMoleculeViewProps = InterSelectFieldMolecule & {
    forwardedRef?: React.Ref<HTMLSelectElement>;
    value?: string;
};
export declare const SelectFieldMoleculeView: React.FC<SelectFieldMoleculeViewProps>;
export {};
