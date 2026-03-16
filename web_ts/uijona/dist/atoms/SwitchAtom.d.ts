import React from 'react';
import { InterEventsSwitchAtom } from './events/InterEventsSwitchAtom';
type SwitchSize = 'sm' | 'md' | 'lg';
interface SwitchAtomProps extends InterEventsSwitchAtom {
    id?: string;
    checked?: boolean;
    disabled?: boolean;
    hasError?: boolean;
    size?: SwitchSize;
    className?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
export declare const SwitchAtom: React.FC<SwitchAtomProps>;
export {};
