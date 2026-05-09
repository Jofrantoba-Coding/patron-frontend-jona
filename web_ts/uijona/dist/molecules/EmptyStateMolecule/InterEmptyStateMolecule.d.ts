import { default as React } from '../../../node_modules/react';

export interface EmptyStateAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}
export interface InterEmptyStateMolecule extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: EmptyStateAction[];
}
