// InterSidebarLayout.ts — JONA Interface + defaults
import React from 'react';

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

export const SIDEBAR_LAYOUT_DEFAULTS: Required<Pick<InterSidebarLayout,
  'collapsible' | 'defaultCollapsed' | 'sidebarWidth'
>> = {
  collapsible: true,
  defaultCollapsed: false,
  sidebarWidth: '16rem',
};
