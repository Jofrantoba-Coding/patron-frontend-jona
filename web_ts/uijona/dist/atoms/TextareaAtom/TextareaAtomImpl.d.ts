import { default as React } from '../../../node_modules/react';
import { InterTextareaAtom } from './InterTextareaAtom';

export declare const TextareaAtomImpl: React.ForwardRefExoticComponent<InterTextareaAtom & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onBlur" | "onKeyDown" | "onChange"> & React.RefAttributes<HTMLTextAreaElement>>;
