import { default as React } from '../../../node_modules/react';
import { InterSidebarLayout, SidebarNavItem } from './InterSidebarLayout';

interface SidebarLayoutViewProps extends Omit<InterSidebarLayout, 'defaultCollapsed' | 'collapsible'> {
    collapsed: boolean;
    mobileOpen: boolean;
    collapsible: boolean;
    onToggleCollapse: () => void;
    onToggleMobile: () => void;
    onCloseMobile: () => void;
    onItemClick: (item: SidebarNavItem) => void;
}
export declare const SidebarLayoutView: React.FC<SidebarLayoutViewProps>;
export {};
