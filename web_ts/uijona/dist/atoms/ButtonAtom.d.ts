import React from 'react';
import { InterEventsButtonAtom } from './events/InterEventsButtonAtom';
export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
interface ButtonAtomProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof InterEventsButtonAtom>, InterEventsButtonAtom {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
}
export declare const ButtonAtom: React.ForwardRefExoticComponent<ButtonAtomProps & React.RefAttributes<HTMLButtonElement>>;
export {};
