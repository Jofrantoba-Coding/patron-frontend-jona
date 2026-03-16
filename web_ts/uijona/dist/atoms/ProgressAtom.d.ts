import React from 'react';
type ProgressVariant = 'default' | 'success' | 'danger' | 'warning';
interface ProgressAtomProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    variant?: ProgressVariant;
    showLabel?: boolean;
    label?: string;
}
export declare const ProgressAtom: React.FC<ProgressAtomProps>;
export {};
