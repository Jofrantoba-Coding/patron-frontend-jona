import { default as React } from '../../../node_modules/react';
import { InterRadioAtom } from './InterRadioAtom';

export declare const RadioAtomImpl: React.ForwardRefExoticComponent<InterRadioAtom & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "checked"> & React.RefAttributes<HTMLInputElement>>;
