// JUserMenuImpl.tsx — JONA Implementation
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { nextRovingIndex } from '../../lib/roving';
import { useMenuPopup } from '../../lib/menuPopup';
import { InterJUserMenu, JUserMenuItem } from './InterJUserMenu';
import { JUserMenuEntry, JUserMenuView } from './JUserMenuView';

/** Up to two initials from the first two words of the name. */
export const initialsOf = (name: string): string =>
  name.trim().split(/\s+/).slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join('');

const entriesOf = (items: JUserMenuItem[]): JUserMenuEntry[] =>
  items.flatMap((item): JUserMenuEntry[] =>
    item.kind === 'radio'
      ? item.options.map((option) => ({ key: `${item.id}:${option.value}`, item, option }))
      : [{ key: item.id, item }],
  );

export const JUserMenuImpl: React.FC<InterJUserMenu> = ({
  name, subtitle, avatarSrc, items, onAction, onRadioChange,
}) => {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const entryRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const entries = entriesOf(items);

  const close = useCallback(() => setOpen(false), []);
  // D9: Esc on the menu's own root (no document listener) and an outside press close it.
  const popup = useMenuPopup({ open, rootRef, triggerRef: buttonRef, onClose: close });

  useEffect(() => {
    if (open) entryRefs.current[focusIndex]?.focus();
  }, [open, focusIndex]);

  const openAt = (index: number) => {
    setFocusIndex(index);
    setOpen(true);
  };

  const activate = (entry: JUserMenuEntry) => {
    if (entry.item.kind === 'action' && entry.item.disabled) return;
    setOpen(false);
    buttonRef.current?.focus();
    if (entry.item.kind === 'radio' && entry.option) onRadioChange?.(entry.option.value, entry.item.id);
    else onAction(entry.item.id);
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const entry = entries[focusIndex];
      if (entry) activate(entry);
      return;
    }
    if (event.key === 'Tab') {
      setOpen(false);
      return;
    }
    const next = nextRovingIndex(focusIndex, entries.length, event.key, { orientation: 'vertical' });
    if (next === null) return;
    event.preventDefault();
    setFocusIndex(next);
    entryRefs.current[next]?.focus();
  };

  return (
    <JUserMenuView
      name={name}
      subtitle={subtitle}
      avatarSrc={avatarSrc}
      initials={initialsOf(name)}
      items={items}
      entries={entries}
      open={open}
      menuId={`${baseId}-menu`}
      groupLabelId={(id) => `${baseId}-group-${id}`}
      rootRef={rootRef}
      buttonRef={buttonRef}
      setEntryRef={(index) => (element) => {
        entryRefs.current[index] = element;
      }}
      onRootKeyDown={popup.onKeyDown}
      onButtonClick={() => (open ? setOpen(false) : openAt(0))}
      onButtonKeyDown={(event) => {
        if (open || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
        event.preventDefault();
        openAt(event.key === 'ArrowDown' ? 0 : entries.length - 1);
      }}
      onMenuKeyDown={onMenuKeyDown}
      onEntryClick={activate}
    />
  );
};

JUserMenuImpl.displayName = 'JUserMenu';
