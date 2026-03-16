import React from 'react';
import { InterEventsTooltipMolecule } from './events/InterEventsTooltipMolecule';
type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
interface TooltipMoleculeProps extends InterEventsTooltipMolecule {
    content: React.ReactNode;
    side?: TooltipSide;
    delayMs?: number;
    className?: string;
    children: React.ReactElement;
}
export declare const TooltipMolecule: React.FC<TooltipMoleculeProps>;
export {};
