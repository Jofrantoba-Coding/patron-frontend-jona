import React from 'react';
import { JButtonVariant } from '../JButton';
export interface InterIconButtonAtom extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    icon: React.ReactNode;
    label: string;
    variant?: JButtonVariant;
    loading?: boolean;
}
export declare const ICON_BUTTON_ATOM_DEFAULTS: Required<Pick<InterIconButtonAtom, 'variant' | 'loading'>>;
