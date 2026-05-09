import { default as React } from '../../../node_modules/react';
import { ButtonVariant } from '../ButtonAtom';

export interface InterIconButtonAtom extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    icon: React.ReactNode;
    label: string;
    variant?: ButtonVariant;
    loading?: boolean;
}
export declare const ICON_BUTTON_ATOM_DEFAULTS: Required<Pick<InterIconButtonAtom, 'variant' | 'loading'>>;
