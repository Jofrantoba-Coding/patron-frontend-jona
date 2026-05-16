import React from 'react';
import { InterInputAtom } from './InterInputAtom';
export declare const InputAtomImpl: React.ForwardRefExoticComponent<InterInputAtom & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onBlur" | "onChange" | "onKeyDown"> & React.RefAttributes<HTMLInputElement>>;
