import React from 'react';
import { InterJTooltip } from './InterJTooltip';
export interface JTooltipViewProps extends InterJTooltip {
    tooltipId: string;
    visible: boolean;
    style: React.CSSProperties;
    triggerRef: React.RefObject<HTMLSpanElement>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
}
export declare const JTooltipView: React.FC<JTooltipViewProps>;
