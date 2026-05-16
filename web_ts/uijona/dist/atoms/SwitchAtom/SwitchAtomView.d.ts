import { default as React } from '../../../node_modules/react';
import { InterSwitchAtom } from './InterSwitchAtom';

interface SwitchAtomViewProps extends InterSwitchAtom {
    id?: string;
    'aria-labelledby'?: string;
    onClick?: () => void;
}
export declare const SwitchAtomView: React.FC<SwitchAtomViewProps>;
export {};
