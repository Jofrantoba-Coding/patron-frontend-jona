import React from 'react';
import { InterEventsInputAtom } from './events/InterEventsInputAtom';
interface InputAtomProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown'>, InterEventsInputAtom {
    hasError?: boolean;
}
export declare const InputAtom: React.ForwardRefExoticComponent<InputAtomProps & React.RefAttributes<HTMLInputElement>>;
export {};
