import React from 'react';
import { AccordionItem, InterAccordionMolecule } from './InterAccordionMolecule';
interface AccordionMoleculeViewProps extends InterAccordionMolecule {
    openValues: string[];
    onItemToggle: (item: AccordionItem) => void;
}
export declare const AccordionMoleculeView: React.FC<AccordionMoleculeViewProps>;
export {};
