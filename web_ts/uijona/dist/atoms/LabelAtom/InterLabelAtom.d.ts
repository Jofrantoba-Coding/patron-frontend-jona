import { default as React } from '../../../node_modules/react';

export interface InterLabelAtom extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
    required?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
}
