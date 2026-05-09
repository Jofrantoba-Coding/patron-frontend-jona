import React from 'react';
import { InterTooltipMolecule } from './InterTooltipMolecule';
interface TooltipMoleculeViewProps extends InterTooltipMolecule {
    visible: boolean;
    style: React.CSSProperties;
    triggerRef: React.RefObject<HTMLSpanElement>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
}
export declare const TooltipMoleculeView: React.FC<TooltipMoleculeViewProps>;
export {};
