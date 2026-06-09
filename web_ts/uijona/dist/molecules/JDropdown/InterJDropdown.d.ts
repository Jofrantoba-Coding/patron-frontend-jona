import React from 'react';
export interface JDropdownItem {
    label: string;
    icon?: React.ReactNode;
    shortcut?: string;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
    onClick?: () => void;
}
export interface JDropdownGroup {
    label?: string;
    items: JDropdownItem[];
}
export interface InterJDropdown {
    trigger: React.ReactNode;
    groups: JDropdownGroup[];
    align?: 'start' | 'end';
    className?: string;
    onOpen?: () => void;
    onClose?: () => void;
    onItemSelect?: (label: string) => void;
    onDisabledItemClick?: (label: string) => void;
}
export declare const JDROPDOWN_DEFAULTS: Required<Pick<InterJDropdown, 'align'>>;
