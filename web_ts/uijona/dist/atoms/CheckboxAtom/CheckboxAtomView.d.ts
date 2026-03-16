import React from 'react';
import { InterCheckboxAtom } from './InterCheckboxAtom';
interface CheckboxAtomViewProps extends InterCheckboxAtom {
    forwardedRef?: React.Ref<HTMLInputElement>;
    [key: string]: unknown;
}
export declare const CheckboxAtomView: React.FC<CheckboxAtomViewProps>;
export {};
