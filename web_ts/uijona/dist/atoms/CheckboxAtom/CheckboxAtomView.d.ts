import { default as React } from '../../../node_modules/react';
import { InterCheckboxAtom } from './InterCheckboxAtom';

interface CheckboxAtomViewProps extends InterCheckboxAtom {
    forwardedRef?: React.Ref<HTMLInputElement>;
    [key: string]: unknown;
}
export declare const CheckboxAtomView: React.FC<CheckboxAtomViewProps>;
export {};
