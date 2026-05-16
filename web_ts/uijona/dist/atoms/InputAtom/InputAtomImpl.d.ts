import { default as React } from '../../../node_modules/react';
import { InterInputAtom } from './InterInputAtom';

export declare const InputAtomImpl: React.ForwardRefExoticComponent<InterInputAtom & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onBlur" | "onKeyDown" | "onChange"> & React.RefAttributes<HTMLInputElement>>;
