import React from 'react';
export interface AccordionItem {
    value: string;
    title: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}
export interface InterAccordionMolecule {
    items: AccordionItem[];
    value?: string | string[];
    defaultValue?: string | string[];
    multiple?: boolean;
    className?: string;
    onValueChange?: (value: string | string[]) => void;
}
export declare const ACCORDION_MOLECULE_DEFAULTS: Required<Pick<InterAccordionMolecule, 'multiple'>>;
