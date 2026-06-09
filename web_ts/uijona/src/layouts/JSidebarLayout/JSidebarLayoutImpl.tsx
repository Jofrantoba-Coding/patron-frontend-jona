// JSidebarLayoutImpl.tsx — JONA Implementation
import React, { useEffect, useState } from 'react';
import { InterJSidebarLayout, JSIDEBAR_LAYOUT_DEFAULTS, SidebarNavItem } from './InterJSidebarLayout';
import { JSidebarLayoutView } from './JSidebarLayoutView';

export const JSidebarLayoutImpl: React.FC<InterJSidebarLayout> = (props) => {
  const merged = { ...JSIDEBAR_LAYOUT_DEFAULTS, ...props };
  const [collapsed, setCollapsed] = useState(merged.defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleItemClick = (item: SidebarNavItem) => {
    item.onClick?.();
    props.onNavItemClick?.(item);
    setMobileOpen(false);
  };

  return (
    <JSidebarLayoutView
      nav={props.nav}
      header={props.header}
      footer={props.footer}
      activeKey={props.activeKey}
      collapsible={merged.collapsible}
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      sidebarWidth={merged.sidebarWidth}
      className={props.className}
      sidebarClassName={props.sidebarClassName}
      onToggleCollapse={() => setCollapsed((c) => !c)}
      onToggleMobile={() => setMobileOpen((v) => !v)}
      onCloseMobile={() => setMobileOpen(false)}
      onItemClick={handleItemClick}
    >
      {props.children}
    </JSidebarLayoutView>
  );
};

JSidebarLayoutImpl.displayName = 'JSidebarLayout';
