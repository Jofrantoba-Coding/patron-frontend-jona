import React from 'react';
export type JAccordionSize = 'sm' | 'md' | 'lg';
export type JAccordionVariant = 'default' | 'bordered' | 'ghost';
export interface JAccordionItem {
    value: string;
    title: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
    contentClassName?: string;
    contentStyle?: React.CSSProperties;
}
export interface InterJAccordion {
    items: JAccordionItem[];
    value?: string | string[];
    defaultValue?: string | string[];
    multiple?: boolean;
    variant?: JAccordionVariant;
    size?: JAccordionSize;
    className?: string;
    style?: React.CSSProperties;
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
    contentClassName?: string;
    contentStyle?: React.CSSProperties;
    onValueChange?: (value: string | string[]) => void;
}
export declare const JACCORDION_DEFAULTS: {
    readonly multiple: false;
    readonly variant: "default";
    readonly size: "md";
};
