// SidebarLayoutImpl.tsx — JONA Implementation
import React, { useEffect, useState } from 'react';
import { InterSidebarLayout, SIDEBAR_LAYOUT_DEFAULTS, SidebarNavItem } from './InterSidebarLayout';
import { SidebarLayoutView } from './SidebarLayoutView';

export const SidebarLayoutImpl: React.FC<InterSidebarLayout> = (props) => {
  const merged = { ...SIDEBAR_LAYOUT_DEFAULTS, ...props };
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
    <SidebarLayoutView
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
    </SidebarLayoutView>
  );
};

SidebarLayoutImpl.displayName = 'SidebarLayout';
