// JWorkspaceTabsView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import {
  CONTROL_H, FG, FG_MUTED, FOCUS_OVERLAY, FOCUS_RING, HOVER_FG, HOVER_OVERLAY, LINE, SURFACE, SURFACE_MUTED,
  SURFACE_RAISED, TEXT_BODY,
} from '../../theme/tokenClasses';
import { JWorkspaceTab } from './InterJWorkspaceTabs';

/** A tab as rendered: its ids and whether it is visible in the strip or listed in the overflow menu. */
export interface JWorkspaceTabEntry {
  tab: JWorkspaceTab;
  tabId: string;
  panelId: string;
  dirtyId: string;
  visible: boolean;
}

export interface JWorkspaceTabsViewProps {
  ariaLabel: string;
  entries: JWorkspaceTabEntry[];
  /** The visible entries, in strip order; the rest are in `overflow`. */
  visible: JWorkspaceTabEntry[];
  overflow: JWorkspaceTabEntry[];
  activeId: string | null;
  tabStopId: string | null;
  closeLabel: (title: string) => string;
  dirtyLabel: string;
  overflowLabel: string;
  menuOpen: boolean;
  menuId: string;
  renderPanel: (id: string) => React.ReactNode;
  setTabRef: (id: string) => (element: HTMLButtonElement | null) => void;
  setPanelRef: (id: string) => (element: HTMLDivElement | null) => void;
  setMenuItemRef: (index: number) => (element: HTMLButtonElement | null) => void;
  menuRootRef: React.Ref<HTMLDivElement>;
  menuButtonRef: React.Ref<HTMLButtonElement>;
  onTabClick: (id: string) => void;
  onTabAuxClick: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onTabMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onTablistKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onCloseClick: (id: string) => void;
  onMenuRootKeyDown: (event: React.KeyboardEvent) => void;
  onMenuButtonClick: () => void;
  onMenuKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onMenuItemClick: (id: string) => void;
}

const DOT = 'inline-block h-2 w-2 shrink-0 rounded-full bg-primary-600';
const BAR_BUTTON = cn('inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset', CONTROL_H, FOCUS_RING);

const CloseIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const MoreIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const JWorkspaceTabsView: React.FC<JWorkspaceTabsViewProps> = ({
  ariaLabel, entries, visible, overflow, activeId, tabStopId, closeLabel, dirtyLabel, overflowLabel, menuOpen, menuId,
  renderPanel, setTabRef, setPanelRef, setMenuItemRef, menuRootRef, menuButtonRef, onTabClick, onTabAuxClick,
  onTabMouseDown, onTablistKeyDown, onCloseClick, onMenuRootKeyDown, onMenuButtonClick, onMenuKeyDown, onMenuItemClick,
}) => (
  <div className="flex h-full min-h-0 min-w-0 flex-col">
    <div className={cn('flex min-w-0 shrink-0 items-stretch border-b', LINE, SURFACE_MUTED)}>
      <div className="min-w-0 flex-1 overflow-x-auto">
        {/* One grid row: tab i in column 2i+1, its close button in 2i+2. The tablist is a subgrid, so the close
            buttons sit next to their tabs while staying outside the tablist. */}
        <div className="grid w-max auto-cols-max grid-flow-col">
          <div
            role="tablist"
            aria-label={ariaLabel}
            aria-orientation="horizontal"
            onKeyDown={onTablistKeyDown}
            style={{ '--jona-wtabs-span': Math.max(visible.length * 2, 1) } as React.CSSProperties}
            className="col-[1/span_var(--jona-wtabs-span)] row-start-1 grid grid-cols-subgrid"
          >
            {visible.map((entry, index) => {
              const active = entry.tab.id === activeId;
              return (
                <button
                  key={entry.tab.id}
                  ref={setTabRef(entry.tab.id)}
                  id={entry.tabId}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={entry.panelId}
                  aria-describedby={entry.tab.dirty ? entry.dirtyId : undefined}
                  tabIndex={entry.tab.id === tabStopId ? 0 : -1}
                  onClick={() => onTabClick(entry.tab.id)}
                  onAuxClick={(event) => onTabAuxClick(entry.tab.id, event)}
                  onMouseDown={onTabMouseDown}
                  style={{ '--jona-wtab-col': index * 2 + 1 } as React.CSSProperties}
                  className={cn(
                    BAR_BUTTON,
                    'col-start-[var(--jona-wtab-col)] row-start-1 max-w-[14rem] gap-1.5 rounded-ss-md border-b-2 ps-3 pe-1',
                    TEXT_BODY,
                    active
                      ? cn('border-primary-600 font-medium', SURFACE, FG)
                      : cn('border-transparent', FG_MUTED, HOVER_FG, HOVER_OVERLAY),
                  )}
                >
                  <span className="min-w-0 truncate">{entry.tab.title}</span>
                  {entry.tab.dirty && (
                    <>
                      <span aria-hidden="true" className={DOT} />
                      <span id={entry.dirtyId} hidden>{dirtyLabel}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
          {visible.map((entry, index) => {
            const active = entry.tab.id === activeId;
            return (
              <button
                key={entry.tab.id}
                type="button"
                aria-label={closeLabel(entry.tab.title)}
                tabIndex={active ? 0 : -1}
                onClick={() => onCloseClick(entry.tab.id)}
                style={{ '--jona-wtab-col': index * 2 + 2 } as React.CSSProperties}
                className={cn(
                  BAR_BUTTON,
                  'col-start-[var(--jona-wtab-col)] row-start-1 w-8 rounded-se-md border-b-2',
                  active ? cn('border-primary-600', SURFACE, FG) : 'border-transparent',
                  FG_MUTED,
                  HOVER_FG,
                  HOVER_OVERLAY,
                )}
              >
                <CloseIcon />
              </button>
            );
          })}
        </div>
      </div>
      {overflow.length > 0 && (
        <div ref={menuRootRef} className="relative flex shrink-0" onKeyDown={onMenuRootKeyDown}>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={overflowLabel}
            title={overflowLabel}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            onClick={onMenuButtonClick}
            className={cn(BAR_BUTTON, 'gap-1 border-s px-2', TEXT_BODY, LINE, FG_MUTED, HOVER_FG, HOVER_OVERLAY)}
          >
            <span aria-hidden="true">+{overflow.length}</span>
            <MoreIcon />
          </button>
          {menuOpen && (
            <div
              id={menuId}
              role="menu"
              aria-label={overflowLabel}
              onKeyDown={onMenuKeyDown}
              className={cn(
                'absolute end-0 top-full z-[var(--jona-z-dropdown)] mt-1 flex w-56 max-w-[calc(100vw-1rem)] flex-col rounded-md border py-1 shadow-lg',
                LINE,
                SURFACE_RAISED,
              )}
            >
              {overflow.map((entry, index) => (
                <button
                  key={entry.tab.id}
                  ref={setMenuItemRef(index)}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-describedby={entry.tab.dirty ? `${entry.dirtyId}-menu` : undefined}
                  onClick={() => onMenuItemClick(entry.tab.id)}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left focus-visible:outline-none',
                    CONTROL_H,
                    TEXT_BODY,
                    FG,
                    HOVER_OVERLAY,
                    FOCUS_OVERLAY,
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{entry.tab.title}</span>
                  {entry.tab.dirty && (
                    <>
                      <span aria-hidden="true" className={DOT} />
                      <span id={`${entry.dirtyId}-menu`} hidden>{dirtyLabel}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    <div className="min-h-0 min-w-0 flex-1">
      {entries.map((entry) => (
        <div
          key={entry.tab.id}
          ref={setPanelRef(entry.tab.id)}
          id={entry.panelId}
          role="tabpanel"
          aria-labelledby={entry.visible ? entry.tabId : undefined}
          aria-label={entry.visible ? undefined : entry.tab.title}
          hidden={entry.tab.id !== activeId}
          tabIndex={-1}
          className="h-full min-w-0 overflow-auto focus-visible:outline-none"
        >
          {renderPanel(entry.tab.id)}
        </div>
      ))}
    </div>
  </div>
);
