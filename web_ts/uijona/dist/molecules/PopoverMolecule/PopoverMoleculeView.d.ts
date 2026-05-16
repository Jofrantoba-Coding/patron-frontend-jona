import { default as React } from '../../../node_modules/react';

interface PopoverMoleculeViewProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    open: boolean;
    panelStyle: React.CSSProperties;
    triggerRef: React.RefObject<HTMLDivElement>;
    panelRef: React.RefObject<HTMLDivElement>;
    className?: string;
    onTriggerClick: () => void;
}
export declare const PopoverMoleculeView: React.FC<PopoverMoleculeViewProps>;
export {};
