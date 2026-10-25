// JUserMenuView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { JAvatar } from '../../atoms/JAvatar/JAvatar';
import {
  CONTROL_H, DANGER_FG, FG, FG_MUTED, FOCUS_OVERLAY, FOCUS_RING, HOVER_OVERLAY, LINE, LINE_BG, SURFACE_RAISED,
  TEXT_BODY, TEXT_CAPTION, TEXT_SMALL,
} from '../../theme/tokenClasses';
import { JUserMenuItem } from './InterJUserMenu';

/** One focusable entry of the open menu: an action, or one option of a radio group. */
export interface JUserMenuEntry {
  key: string;
  item: JUserMenuItem;
  option?: { value: string; label: string };
}

export interface JUserMenuViewProps {
  name: string;
  subtitle?: string;
  avatarSrc?: string;
  initials: string;
  items: JUserMenuItem[];
  entries: JUserMenuEntry[];
  open: boolean;
  menuId: string;
  groupLabelId: (id: string) => string;
  rootRef: React.Ref<HTMLDivElement>;
  buttonRef: React.Ref<HTMLButtonElement>;
  setEntryRef: (index: number) => (element: HTMLButtonElement | null) => void;
  onRootKeyDown: (event: React.KeyboardEvent) => void;
  onButtonClick: () => void;
  onButtonKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onMenuKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onEntryClick: (entry: JUserMenuEntry) => void;
}

const ITEM = cn('flex w-full items-center gap-2 px-3 py-2 text-left focus-visible:outline-none', CONTROL_H, TEXT_BODY, FOCUS_OVERLAY);

const Check = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const JUserMenuView: React.FC<JUserMenuViewProps> = ({
  name, subtitle, avatarSrc, initials, items, entries, open, menuId, groupLabelId, rootRef, buttonRef, setEntryRef,
  onRootKeyDown, onButtonClick, onButtonKeyDown, onMenuKeyDown, onEntryClick,
}) => {
  const indexOf = (key: string) => entries.findIndex((entry) => entry.key === key);
  const renderEntry = (entry: JUserMenuEntry) => {
    const index = indexOf(entry.key);
    if (entry.option && entry.item.kind === 'radio') {
      const checked = entry.item.value === entry.option.value;
      return (
        <button
          key={entry.key}
          ref={setEntryRef(index)}
          type="button"
          role="menuitemradio"
          aria-checked={checked}
          tabIndex={-1}
          onClick={() => onEntryClick(entry)}
          className={cn(ITEM, HOVER_OVERLAY, FG)}
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">{checked && <Check />}</span>
          <span className="min-w-0 flex-1 truncate">{entry.option.label}</span>
        </button>
      );
    }
    const action = entry.item.kind === 'action' ? entry.item : null;
    return (
      <button
        key={entry.key}
        ref={setEntryRef(index)}
        type="button"
        role="menuitem"
        tabIndex={-1}
        aria-disabled={action?.disabled || undefined}
        onClick={() => onEntryClick(entry)}
        className={cn(
          ITEM,
          action?.disabled ? 'cursor-not-allowed opacity-50' : HOVER_OVERLAY,
          action?.tone === 'danger' ? DANGER_FG : FG,
        )}
      >
        <span className="min-w-0 flex-1 truncate">{entry.item.label}</span>
      </button>
    );
  };

  return (
    <div ref={rootRef} className="relative inline-flex h-fit" onKeyDown={onRootKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={name}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={onButtonClick}
        onKeyDown={onButtonKeyDown}
        className={cn(
          'inline-flex min-w-0 items-center gap-2 rounded-md px-1.5 focus-visible:outline-none focus-visible:ring-2 sm:px-2',
          CONTROL_H,
          TEXT_BODY,
          FOCUS_RING,
          HOVER_OVERLAY,
          FG,
        )}
      >
        <span aria-hidden="true" className="shrink-0"><JAvatar src={avatarSrc} initials={initials} size="sm" /></span>
        <span aria-hidden="true" className="hidden max-w-[12rem] truncate sm:inline">{name}</span>
        <svg className={cn('hidden h-4 w-4 shrink-0 sm:block', FG_MUTED)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className={cn(
            'absolute end-0 top-full z-[var(--jona-z-dropdown)] mt-1 flex w-64 max-w-[calc(100vw-1rem)] flex-col rounded-md border py-1 shadow-lg',
            LINE,
            SURFACE_RAISED,
          )}
        >
          <div className={cn('border-b px-3 pb-2 pt-1', LINE)}>
            <p className={cn('truncate font-semibold', TEXT_BODY, FG)}>{name}</p>
            {subtitle && <p className={cn('truncate', TEXT_SMALL, FG_MUTED)}>{subtitle}</p>}
          </div>
          <div id={menuId} role="menu" aria-label={name} onKeyDown={onMenuKeyDown} className="flex flex-col pt-1">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && item.kind !== items[index - 1].kind && (
                  <div role="separator" className={cn('my-1 h-px', LINE_BG)} />
                )}
                {item.kind === 'radio' ? (
                  <div role="group" aria-labelledby={groupLabelId(item.id)} className="flex flex-col">
                    <span id={groupLabelId(item.id)} className={cn('px-3 pb-1 pt-1 font-semibold', TEXT_CAPTION, FG_MUTED)}>
                      {item.label}
                    </span>
                    {entries.filter((entry) => entry.item === item).map(renderEntry)}
                  </div>
                ) : (
                  renderEntry(entries[indexOf(item.id)])
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
