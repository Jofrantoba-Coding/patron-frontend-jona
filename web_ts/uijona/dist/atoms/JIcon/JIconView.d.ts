import React from 'react';
import { InterJIcon } from './InterJIcon';
type JIconViewProps = InterJIcon & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'> & {
    forwardedRef?: React.Ref<HTMLButtonElement>;
};
export declare const JIconView: React.FC<JIconViewProps>;
export {};
