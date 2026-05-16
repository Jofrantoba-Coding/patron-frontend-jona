import { default as React } from '../../../node_modules/react';

export interface SidebarNavItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    href?: string;
    badge?: string | number;
    onClick?: () => void;
}
export interface SidebarNavGroup {
    label?: string;
    items: SidebarNavItem[];
}
export interface InterSidebarLayout {
    nav: SidebarNavGroup[];
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    activeKey?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    sidebarWidth?: string;
    className?: string;
    sidebarClassName?: string;
    onNavItemClick?: (item: SidebarNavItem) => void;
}
export declare const SIDEBAR_LAYOUT_DEFAULTS: Required<Pick<InterSidebarLayout, 'collapsible' | 'defaultCollapsed' | 'sidebarWidth'>>;
