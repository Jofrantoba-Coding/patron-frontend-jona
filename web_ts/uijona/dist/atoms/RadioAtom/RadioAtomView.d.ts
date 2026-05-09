import { default as React } from '../../../node_modules/react';
import { InterRadioAtom } from './InterRadioAtom';

interface RadioAtomViewProps extends InterRadioAtom {
    forwardedRef?: React.Ref<HTMLInputElement>;
    [key: string]: unknown;
}
export declare const RadioAtomView: React.FC<RadioAtomViewProps>;
export {};
