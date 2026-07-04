export interface SidebarNavItem {
  key: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  onClick?: () => void;
}

export interface SidebarNavGroup {
  label?: string;
  items: SidebarNavItem[];
}

/** Contrato publico de JSidebarLayout. Slots `[jHeader]`, `[jFooter]`; default = main. */
export interface InterJSidebarLayout {
  nav: SidebarNavGroup[];
  activeKey?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  sidebarWidth?: string;
}
