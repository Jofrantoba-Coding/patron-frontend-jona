// InterJSidebarLayout.ts — JONA Interface + defaults
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

/** What custom sidebar content receives from the layout. */
export interface SidebarRenderApi {
  /** Closes the mobile drawer. Call it after navigating from custom content. */
  close: () => void;
  /** Desktop rail state: render a compact variant when true. */
  collapsed: boolean;
  /** True while the mobile drawer is open. */
  mobileOpen: boolean;
}

export interface InterJSidebarLayout {
  /** Flat navigation groups. Ignored when `renderSidebar` is provided. */
  nav?: SidebarNavGroup[];
  /**
   * Custom sidebar content (a tree menu, filters...). Replaces the `nav` list
   * inside the same scrollable area, between `header` and `footer`.
   */
  renderSidebar?: (api: SidebarRenderApi) => React.ReactNode;
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

export const JSIDEBAR_LAYOUT_DEFAULTS: Required<Pick<InterJSidebarLayout,
  'collapsible' | 'defaultCollapsed' | 'sidebarWidth'
>> = {
  collapsible: true,
  defaultCollapsed: false,
  sidebarWidth: '16rem',
};
