import React from 'react';
import { InterDropdownMolecule, DropdownGroup } from './InterDropdownMolecule';
interface DropdownMoleculeViewProps extends InterDropdownMolecule {
    open: boolean;
    menuStyle: React.CSSProperties;
    triggerRef: React.RefObject<HTMLDivElement>;
    menuRef: React.RefObject<HTMLDivElement>;
    onTriggerClick: () => void;
    onItemClick: (group: DropdownGroup['items'][number]) => void;
}
export declare const DropdownMoleculeView: React.FC<DropdownMoleculeViewProps>;
export {};
