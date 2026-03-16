import React from 'react';
interface LabelAtomProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}
export declare const LabelAtom: React.ForwardRefExoticComponent<LabelAtomProps & React.RefAttributes<HTMLLabelElement>>;
export {};
