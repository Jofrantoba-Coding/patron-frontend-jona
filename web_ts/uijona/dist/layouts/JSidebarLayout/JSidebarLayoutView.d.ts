import React from 'react';
import { InterJSidebarLayout, SidebarNavItem } from './InterJSidebarLayout';
interface JSidebarLayoutViewProps extends Omit<InterJSidebarLayout, 'defaultCollapsed' | 'collapsible'> {
    collapsed: boolean;
    mobileOpen: boolean;
    collapsible: boolean;
    onToggleCollapse: () => void;
    onToggleMobile: () => void;
    onCloseMobile: () => void;
    onItemClick: (item: SidebarNavItem) => void;
}
export declare const JSidebarLayoutView: React.FC<JSidebarLayoutViewProps>;
export {};
