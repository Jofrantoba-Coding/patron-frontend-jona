import React from 'react';
export type JPopoverAlign = 'start' | 'center' | 'end';
export type JPopoverSide = 'top' | 'bottom' | 'left' | 'right';
export interface InterJPopover {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: JPopoverAlign;
    side?: JPopoverSide;
    className?: string;
    onOpen?: () => void;
    onClose?: () => void;
}
export declare const JPOPOVER_DEFAULTS: Required<Pick<InterJPopover, 'align' | 'side'>>;
