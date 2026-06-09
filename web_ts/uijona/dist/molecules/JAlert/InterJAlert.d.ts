import React from 'react';
export type JAlertVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';
export interface InterJAlert extends React.HTMLAttributes<HTMLDivElement> {
    variant?: JAlertVariant;
    title?: string;
    icon?: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
}
export declare const JALERT_DEFAULTS: {
    readonly variant: "default";
    readonly dismissible: false;
};
