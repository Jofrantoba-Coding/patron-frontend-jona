import React from 'react';
type AlertVariant = 'default' | 'destructive';
interface AlertMoleculeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
    title?: string;
    icon?: React.ReactNode;
}
export declare const AlertMolecule: React.FC<AlertMoleculeProps>;
export {};
