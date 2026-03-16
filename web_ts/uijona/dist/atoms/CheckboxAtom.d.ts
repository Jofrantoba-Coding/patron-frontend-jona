import React from 'react';
import { InterEventsCheckboxAtom } from './events/InterEventsCheckboxAtom';
interface CheckboxAtomProps extends InterEventsCheckboxAtom {
    id?: string;
    checked?: boolean;
    disabled?: boolean;
    hasError?: boolean;
    className?: string;
    'aria-label'?: string;
}
export declare const CheckboxAtom: React.FC<CheckboxAtomProps>;
export {};
