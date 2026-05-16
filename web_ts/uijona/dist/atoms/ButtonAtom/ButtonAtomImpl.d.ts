import { default as React } from '../../../node_modules/react';
import { InterButtonAtom } from './InterButtonAtom';

export declare const ButtonAtomImpl: React.ForwardRefExoticComponent<InterButtonAtom & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof InterButtonAtom> & React.RefAttributes<HTMLButtonElement>>;
