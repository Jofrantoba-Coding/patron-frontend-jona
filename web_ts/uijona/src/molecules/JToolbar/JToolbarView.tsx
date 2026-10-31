// JToolbarView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton/JButton';
import type { JButtonVariant } from '../../atoms/JButton/InterJButton';
import {
  CONTROL_H, DANGER_FG, FG, FOCUS_OVERLAY, HOVER_OVERLAY, LINE, LINE_BG, SURFACE_RAISED, TEXT_BODY,
} from '../../theme/tokenClasses';
import { JToolbarItem, JToolbarTone } from './InterJToolbar';

/** Roving slot id of the overflow menu button. */
export const JTOOLBAR_MORE = '__jtoolbar-more__';

const TONE_VARIANT: Record<JToolbarTone, JButtonVariant> = {
  primary: 'default',
  default: 'outline',
  danger: 'outline',
};

const TONE_CLASSES: Record<JToolbarTone, string> = {
  primary: '',
  default: '',
  danger: DANGER_FG,
};

const DotsIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export interface JToolbarViewProps {
  ariaLabel: string;
  overflowLabel: string;
  inline: JToolbarItem[];
  overflow: JToolbarItem[];
  /** The slot that holds the single tab stop. */
  tabStop: string | null;
  menuOpen: boolean;
  menuId: string;
  reasonId: (id: string) => string;
  popupRef: React.Ref<HTMLDivElement>;
  moreRef: React.Ref<HTMLButtonElement>;
  setItemRef: (slot: string) => (element: HTMLButtonElement | null) => void;
  setMenuItemRef: (index: number) => (element: HTMLButtonElement | null) => void;
  onToolbarKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onSlotFocus: (slot: string) => void;
  onItemClick: (item: JToolbarItem) => void;
  onMoreClick: () => void;
  onPopupKeyDown: (event: React.KeyboardEvent) => void;
  onMenuKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onMenuItemClick: (item: JToolbarItem) => void;
}

const tooltipOf = (item: JToolbarItem): string | undefined => {
  if (item.disabled && item.disabledReason) return item.disabledReason;
  return item.shortcut ? `${item.label} (${item.shortcut})` : undefined;
};

const Reason: React.FC<{ id: string; item: JToolbarItem }> = ({ id, item }) =>
  item.disabled && item.disabledReason ? <span id={id} hidden>{item.disabledReason}</span> : null;

export const JToolbarView: React.FC<JToolbarViewProps> = ({
  ariaLabel, overflowLabel, inline, overflow, tabStop, menuOpen, menuId, reasonId, popupRef, moreRef,
  setItemRef, setMenuItemRef, onToolbarKeyDown, onSlotFocus, onItemClick, onMoreClick, onPopupKeyDown,
  onMenuKeyDown, onMenuItemClick,
}) => (
  <div
    role="toolbar"
    aria-label={ariaLabel}
    aria-orientation="horizontal"
    onKeyDown={onToolbarKeyDown}
    className="flex w-full min-w-0 max-w-full flex-row flex-wrap items-center gap-2"
  >
    {inline.map((item, index) => {
      const tone = item.tone ?? 'default';
      const describedBy = item.disabled && item.disabledReason ? reasonId(item.id) : undefined;
      return (
        <React.Fragment key={item.id}>
          {index > 0 && inline[index - 1].group !== item.group && (
            <div role="separator" aria-orientation="vertical" className={cn('h-6 w-px self-center', LINE_BG)} />
          )}
          <JButton
            ref={setItemRef(item.id)}
            variant={TONE_VARIANT[tone]}
            density="auto"
            icon={item.icon}
            disabled={item.disabled}
            tabIndex={tabStop === item.id ? 0 : -1}
            title={tooltipOf(item)}
            aria-describedby={describedBy}
            aria-keyshortcuts={item.shortcut}
            onFocus={() => onSlotFocus(item.id)}
            onClick={() => onItemClick(item)}
            className={cn(CONTROL_H, TONE_CLASSES[tone])}
          >
            {item.label}
          </JButton>
          <Reason id={reasonId(item.id)} item={item} />
        </React.Fragment>
      );
    })}
    {overflow.length > 0 && (
      <div ref={popupRef} className="relative inline-flex" onKeyDown={onPopupKeyDown}>
        <JButton
          ref={moreRef}
          variant="outline"
          density="auto"
          icon={<DotsIcon />}
          tabIndex={tabStop === JTOOLBAR_MORE ? 0 : -1}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? menuId : undefined}
          onFocus={() => onSlotFocus(JTOOLBAR_MORE)}
          onClick={onMoreClick}
          className={CONTROL_H}
        >
          {overflowLabel}
        </JButton>
        {menuOpen && (
          <div
            id={menuId}
            role="menu"
            aria-label={overflowLabel}
            onKeyDown={onMenuKeyDown}
            className={cn(
              'absolute end-0 top-full z-[var(--jona-z-dropdown)] mt-1 flex min-w-[12rem] max-w-[calc(100vw-1rem)] flex-col rounded-md border py-1 shadow-lg',
              LINE,
              SURFACE_RAISED,
            )}
          >
            {overflow.map((item, index) => (
              <React.Fragment key={item.id}>
                <button
                  ref={setMenuItemRef(index)}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={item.disabled || undefined}
                  aria-describedby={item.disabled && item.disabledReason ? reasonId(item.id) : undefined}
                  aria-keyshortcuts={item.shortcut}
                  title={tooltipOf(item)}
                  onClick={() => onMenuItemClick(item)}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left focus-visible:outline-none',
                    CONTROL_H,
                    TEXT_BODY,
                    FOCUS_OVERLAY,
                    item.disabled ? 'cursor-not-allowed opacity-50' : HOVER_OVERLAY,
                    item.tone === 'danger' ? DANGER_FG : FG,
                  )}
                >
                  {item.icon && <span className="h-4 w-4 shrink-0" aria-hidden="true">{item.icon}</span>}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
                <Reason id={reasonId(item.id)} item={item} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);
