import React from 'react';
import { InterJChip } from './InterJChip';
type JChipViewProps = InterJChip & Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children' | 'onClick'> & {
    forwardedRef?: React.Ref<HTMLSpanElement>;
};
export declare const JChipView: React.FC<JChipViewProps>;
export {};
