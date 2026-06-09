import React from 'react';
export interface JEmptyStateAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}
export interface InterJEmptyState extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: JEmptyStateAction[];
}
