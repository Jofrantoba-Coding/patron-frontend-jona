import React from 'react';
import { InterJAccordion, JAccordionItem } from './InterJAccordion';
interface JAccordionViewProps extends InterJAccordion {
    openValues: string[];
    onItemToggle: (item: JAccordionItem) => void;
}
export declare const JAccordionView: React.FC<JAccordionViewProps>;
export {};
