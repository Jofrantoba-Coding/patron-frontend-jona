import React from 'react';
export interface InterServiceCardMolecule extends React.HTMLAttributes<HTMLDivElement> {
    icon?: string;
    title: string;
    description: string;
    tags?: string[];
    href?: string;
}
export declare const SERVICE_CARD_MOLECULE_DEFAULTS: Partial<InterServiceCardMolecule>;
