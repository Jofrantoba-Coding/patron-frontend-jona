import React from 'react';
interface ErrorMessageAtomProps extends React.HTMLAttributes<HTMLParagraphElement> {
    message?: string;
    type?: 'error' | 'description';
}
export declare const ErrorMessageAtom: React.FC<ErrorMessageAtomProps>;
export {};
