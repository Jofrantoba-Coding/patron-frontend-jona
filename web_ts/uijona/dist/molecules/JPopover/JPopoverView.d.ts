import React from 'react';
interface JPopoverViewProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    open: boolean;
    panelStyle: React.CSSProperties;
    triggerRef: React.RefObject<HTMLDivElement>;
    panelRef: React.RefObject<HTMLDivElement>;
    className?: string;
    onTriggerClick: () => void;
}
export declare const JPopoverView: React.FC<JPopoverViewProps>;
export {};
