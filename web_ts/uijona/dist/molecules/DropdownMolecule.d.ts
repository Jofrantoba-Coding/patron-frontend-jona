import React from 'react';
import { InterEventsDropdownMolecule } from './events/InterEventsDropdownMolecule';
export interface DropdownItem {
    label: string;
    icon?: React.ReactNode;
    shortcut?: string;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
    onClick?: () => void;
}
export interface DropdownGroup {
    label?: string;
    items: DropdownItem[];
}
interface DropdownMoleculeProps extends InterEventsDropdownMolecule {
    trigger: React.ReactNode;
    groups: DropdownGroup[];
    align?: 'start' | 'end';
    className?: string;
}
export declare const DropdownMolecule: React.FC<DropdownMoleculeProps>;
export {};
