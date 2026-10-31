// JAppShellImpl.tsx — JONA Implementation
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useFocusTrap } from '../../lib/focus';
import { useMenuPopup } from '../../lib/menuPopup';
import { InterJAppShell, JAPPSHELL_DEFAULTS } from './InterJAppShell';
import { JAppShellView } from './JAppShellView';

/** From this width (Tailwind `lg`) the sidebar is inline and the drawer never shows. */
const LG = 1024;

export const JAppShellImpl: React.FC<InterJAppShell> = ({
  brand, topbarEnd, sidebar, children, sidebarWidth, railWidth, defaultCollapsed, navLabel, openMenuLabel,
  closeMenuLabel, collapseLabel, onCollapsedChange,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed ?? JAPPSHELL_DEFAULTS.defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navId = `${useId()}-nav`;
  const drawerRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  // D9: the drawer handles Esc on its own root and closes on an outside press.
  const popup = useMenuPopup({ open: mobileOpen, rootRef: drawerRef, triggerRef: openRef, onClose: closeMobile });
  // While open the drawer is modal: focus moves in, Tab cycles, and focus returns to the opener.
  const trapKeyDown = useFocusTrap(drawerRef, mobileOpen);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onResize = () => {
      if (window.innerWidth >= LG) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  return (
    <JAppShellView
      brand={brand}
      topbarEnd={topbarEnd}
      sidebar={sidebar}
      sidebarWidth={sidebarWidth ?? JAPPSHELL_DEFAULTS.sidebarWidth}
      railWidth={railWidth ?? JAPPSHELL_DEFAULTS.railWidth}
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      navId={navId}
      navLabel={navLabel ?? JAPPSHELL_DEFAULTS.navLabel}
      openMenuLabel={openMenuLabel ?? JAPPSHELL_DEFAULTS.openMenuLabel}
      closeMenuLabel={closeMenuLabel ?? JAPPSHELL_DEFAULTS.closeMenuLabel}
      collapseLabel={collapseLabel ?? JAPPSHELL_DEFAULTS.collapseLabel}
      drawerRef={drawerRef}
      openRef={openRef}
      onDrawerKeyDown={(event) => {
        popup.onKeyDown(event);
        trapKeyDown(event);
      }}
      onOpenMobile={() => setMobileOpen(true)}
      onCloseMobile={closeMobile}
      onToggleCollapse={() => {
        const next = !collapsed;
        setCollapsed(next);
        onCollapsedChange?.(next);
      }}
    >
      {children}
    </JAppShellView>
  );
};

JAppShellImpl.displayName = 'JAppShell';
