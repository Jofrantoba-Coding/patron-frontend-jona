import React from 'react';
import { InterTextareaAtom } from './InterTextareaAtom';
export declare const TextareaAtomImpl: React.ForwardRefExoticComponent<InterTextareaAtom & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onBlur" | "onChange" | "onKeyDown"> & React.RefAttributes<HTMLTextAreaElement>>;
