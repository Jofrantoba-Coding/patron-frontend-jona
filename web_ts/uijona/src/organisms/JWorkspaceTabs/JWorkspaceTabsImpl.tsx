// JWorkspaceTabsImpl.tsx — JONA Implementation
import React, { useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { nextRovingIndex } from '../../lib/roving';
import { useMenuPopup } from '../../lib/menuPopup';
import { InterJWorkspaceTabs, JWORKSPACETABS_DEFAULTS, JWorkspaceTab, JWorkspaceTabsHandle } from './InterJWorkspaceTabs';
import { JWorkspaceTabEntry, JWorkspaceTabsView } from './JWorkspaceTabsView';

/**
 * The tabs shown in the strip. Without `maxVisible` (or when they fit) every tab is visible.
 * Otherwise the first `maxVisible` are, and an overflowed active tab takes the last slot.
 */
export function visibleTabIds(tabs: JWorkspaceTab[], activeId: string | null, maxVisible?: number): Set<string> {
  if (maxVisible === undefined || tabs.length <= maxVisible) return new Set(tabs.map((tab) => tab.id));
  const slots = Math.max(maxVisible, 1);
  const head = tabs.slice(0, slots).map((tab) => tab.id);
  if (activeId === null || head.includes(activeId) || !tabs.some((tab) => tab.id === activeId)) return new Set(head);
  return new Set([...head.slice(0, slots - 1), activeId]);
}

export const JWorkspaceTabsImpl = React.forwardRef<JWorkspaceTabsHandle, InterJWorkspaceTabs>((props, ref) => {
  const { tabs, activeId, maxVisible, renderPanel, onSelect, onCloseRequest } = props;
  const ariaLabel = props.ariaLabel ?? JWORKSPACETABS_DEFAULTS.ariaLabel;
  const closeLabel = props.closeLabel ?? JWORKSPACETABS_DEFAULTS.closeLabel;
  const dirtyLabel = props.dirtyLabel ?? JWORKSPACETABS_DEFAULTS.dirtyLabel;
  const overflowLabel = props.overflowLabel ?? JWORKSPACETABS_DEFAULTS.overflowLabel;

  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuRootRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);

  const shown = visibleTabIds(tabs, activeId, maxVisible);
  const entries: JWorkspaceTabEntry[] = tabs.map((tab, index) => ({
    tab,
    tabId: `${baseId}-tab-${index}`,
    panelId: `${baseId}-panel-${index}`,
    dirtyId: `${baseId}-dirty-${index}`,
    visible: shown.has(tab.id),
  }));
  const visible = entries.filter((entry) => entry.visible);
  const overflow = entries.filter((entry) => !entry.visible);
  const tabStopId = visible.some((entry) => entry.tab.id === activeId) ? activeId : visible[0]?.tab.id ?? null;

  useImperativeHandle(ref, () => ({ focusPanel: (id: string) => panelRefs.current[id]?.focus() }), []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  // D9: Esc on the overflow root (no document listener) and an outside press close the menu.
  const popup = useMenuPopup({ open: menuOpen, rootRef: menuRootRef, triggerRef: menuButtonRef, onClose: closeMenu });

  useEffect(() => {
    if (menuOpen) menuItemRefs.current[menuIndex]?.focus();
  }, [menuOpen, menuIndex]);

  // A tab picked from the overflow menu takes focus once the host has made it active (and visible).
  useEffect(() => {
    if (pendingFocus.current === null || pendingFocus.current !== activeId) return;
    tabRefs.current[activeId]?.focus();
    pendingFocus.current = null;
  }, [activeId]);

  const onTablistKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = visible.findIndex((entry) => entry.tabId === (event.target as HTMLElement).id);
    if (current < 0) return;
    const next = nextRovingIndex(current, visible.length, event.key, { orientation: 'horizontal' });
    if (next === null) return;
    event.preventDefault();
    if (next === current) return;
    const id = visible[next].tab.id;
    tabRefs.current[id]?.focus();
    onSelect(id);
  };

  const pick = (id: string) => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
    pendingFocus.current = id;
    onSelect(id);
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const entry = overflow[menuIndex];
      if (entry) pick(entry.tab.id);
      return;
    }
    if (event.key === 'Tab') {
      setMenuOpen(false);
      return;
    }
    const next = nextRovingIndex(menuIndex, overflow.length, event.key, { orientation: 'vertical' });
    if (next === null) return;
    event.preventDefault();
    setMenuIndex(next);
    menuItemRefs.current[next]?.focus();
  };

  return (
    <JWorkspaceTabsView
      ariaLabel={ariaLabel}
      entries={entries}
      visible={visible}
      overflow={overflow}
      activeId={activeId}
      tabStopId={tabStopId}
      closeLabel={closeLabel}
      dirtyLabel={dirtyLabel}
      overflowLabel={overflowLabel}
      menuOpen={menuOpen}
      menuId={`${baseId}-menu`}
      renderPanel={renderPanel}
      setTabRef={(id) => (element) => {
        tabRefs.current[id] = element;
      }}
      setPanelRef={(id) => (element) => {
        panelRefs.current[id] = element;
      }}
      setMenuItemRef={(index) => (element) => {
        menuItemRefs.current[index] = element;
      }}
      menuRootRef={menuRootRef}
      menuButtonRef={menuButtonRef}
      onTabClick={onSelect}
      onTabAuxClick={(id, event) => {
        if (event.button !== 1) return;
        event.preventDefault();
        onCloseRequest(id);
      }}
      onTabMouseDown={(event) => {
        // A middle press would start the browser's autoscroll.
        if (event.button === 1) event.preventDefault();
      }}
      onTablistKeyDown={onTablistKeyDown}
      onCloseClick={onCloseRequest}
      onMenuRootKeyDown={popup.onKeyDown}
      onMenuButtonClick={() => {
        if (menuOpen) {
          setMenuOpen(false);
          return;
        }
        setMenuIndex(0);
        setMenuOpen(true);
      }}
      onMenuKeyDown={onMenuKeyDown}
      onMenuItemClick={pick}
    />
  );
});

JWorkspaceTabsImpl.displayName = 'JWorkspaceTabs';
