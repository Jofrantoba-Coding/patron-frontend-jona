import React from 'react';
import { InterButtonAtom } from './InterButtonAtom';
interface ButtonAtomViewProps extends InterButtonAtom {
    forwardedRef?: React.Ref<HTMLButtonElement>;
    [key: string]: unknown;
}
export declare const ButtonAtomView: React.FC<ButtonAtomViewProps>;
export {};
