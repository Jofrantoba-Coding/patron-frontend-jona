// JToolbarImpl.tsx — JONA Implementation
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { nextRovingIndex } from '../../lib/roving';
import { useMenuPopup } from '../../lib/menuPopup';
import { InterJToolbar, JTOOLBAR_DEFAULTS, JToolbarItem } from './InterJToolbar';
import { JTOOLBAR_MORE, JToolbarView } from './JToolbarView';

interface Slot {
  id: string;
  enabled: boolean;
}

export const JToolbarImpl: React.FC<InterJToolbar> = ({ ariaLabel, items, overflowLabel, onAction }) => {
  const inline = items.filter((item) => !item.overflow);
  const overflow = items.filter((item) => item.overflow);
  const slots: Slot[] = [
    ...inline.map((item) => ({ id: item.id, enabled: !item.disabled })),
    ...(overflow.length > 0 ? [{ id: JTOOLBAR_MORE, enabled: true }] : []),
  ];

  const [focused, setFocused] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const baseId = useId();
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);

  const enabledSlot = (id: string | null) => slots.find((slot) => slot.id === id && slot.enabled);
  const tabStop = enabledSlot(focused)?.id ?? slots.find((slot) => slot.enabled)?.id ?? null;

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const popup = useMenuPopup({ open: menuOpen, rootRef: popupRef, triggerRef: moreRef, onClose: closeMenu });

  useEffect(() => {
    if (menuOpen) menuItemRefs.current[menuIndex]?.focus();
  }, [menuOpen, menuIndex]);

  const focusSlot = (id: string) => {
    setFocused(id);
    (id === JTOOLBAR_MORE ? moreRef.current : itemRefs.current.get(id))?.focus();
  };

  const onToolbarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (popupRef.current?.querySelector('[role="menu"]')?.contains(event.target as Node)) return;
    const current = slots.findIndex((slot) => slot.id === tabStop);
    const next = nextRovingIndex(current, slots.length, event.key, {
      orientation: 'horizontal',
      isEnabled: (index) => slots[index].enabled,
    });
    if (next === null) return;
    event.preventDefault();
    focusSlot(slots[next].id);
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const next = nextRovingIndex(menuIndex, overflow.length, event.key, { orientation: 'vertical' });
    if (next === null) return;
    event.preventDefault();
    setMenuIndex(next);
    menuItemRefs.current[next]?.focus();
  };

  const onMenuItemClick = (item: JToolbarItem) => {
    if (item.disabled) return;
    setMenuOpen(false);
    moreRef.current?.focus();
    onAction(item.id);
  };

  return (
    <JToolbarView
      ariaLabel={ariaLabel}
      overflowLabel={overflowLabel ?? JTOOLBAR_DEFAULTS.overflowLabel}
      inline={inline}
      overflow={overflow}
      tabStop={tabStop}
      menuOpen={menuOpen}
      menuId={`${baseId}-menu`}
      reasonId={(id) => `${baseId}-reason-${id}`}
      popupRef={popupRef}
      moreRef={moreRef}
      setItemRef={(id) => (element) => {
        if (element) itemRefs.current.set(id, element);
        else itemRefs.current.delete(id);
      }}
      setMenuItemRef={(index) => (element) => {
        menuItemRefs.current[index] = element;
      }}
      onToolbarKeyDown={onToolbarKeyDown}
      onSlotFocus={setFocused}
      onItemClick={(item) => {
        if (!item.disabled) onAction(item.id);
      }}
      onMoreClick={() => {
        setMenuIndex(0);
        setMenuOpen((open) => !open);
      }}
      onPopupKeyDown={popup.onKeyDown}
      onMenuKeyDown={onMenuKeyDown}
      onMenuItemClick={onMenuItemClick}
    />
  );
};

JToolbarImpl.displayName = 'JToolbar';
