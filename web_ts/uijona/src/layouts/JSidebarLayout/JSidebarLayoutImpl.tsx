// JSidebarLayoutImpl.tsx — JONA Implementation
import React, { useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../../lib/focus';
import { InterJSidebarLayout, JSIDEBAR_LAYOUT_DEFAULTS, SidebarNavItem } from './InterJSidebarLayout';
import { JSidebarLayoutView } from './JSidebarLayoutView';

export const JSidebarLayoutImpl: React.FC<InterJSidebarLayout> = (props) => {
  const merged = { ...JSIDEBAR_LAYOUT_DEFAULTS, ...props };
  const [collapsed, setCollapsed] = useState(merged.defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;
  // While open on mobile the drawer is modal: Tab must not reach the page behind it.
  const onSidebarKeyDown = useFocusTrap(sidebarRef, mobileOpen);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Escape closes the mobile drawer (it is a modal dialog while open)
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const handleItemClick = (item: SidebarNavItem) => {
    item.onClick?.();
    props.onNavItemClick?.(item);
    setMobileOpen(false);
  };

  return (
    <JSidebarLayoutView
      nav={props.nav}
      renderSidebar={props.renderSidebar}
      header={props.header}
      footer={props.footer}
      activeKey={props.activeKey}
      collapsible={merged.collapsible}
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      sidebarRef={sidebarRef}
      onSidebarKeyDown={onSidebarKeyDown}
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
