// JAppShellView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import type { SidebarRenderApi } from '../JSidebarLayout/InterJSidebarLayout';
import {
  BACKDROP, FG, FG_MUTED, FOCUS_RING, HOVER_FG, HOVER_OVERLAY, LINE, SURFACE, SURFACE_MUTED, TEXT_BODY,
} from '../../theme/tokenClasses';

export interface JAppShellViewProps {
  brand: React.ReactNode;
  topbarEnd?: React.ReactNode;
  sidebar: (api: SidebarRenderApi) => React.ReactNode;
  children: React.ReactNode;
  sidebarWidth: string;
  railWidth: string;
  collapsed: boolean;
  mobileOpen: boolean;
  navId: string;
  navLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  collapseLabel: string;
  drawerRef: React.RefObject<HTMLDivElement>;
  openRef: React.RefObject<HTMLButtonElement>;
  onDrawerKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}

const ICON_BUTTON = cn(
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md sm:min-h-9 sm:min-w-9',
  'focus-visible:outline-none focus-visible:ring-2',
  FOCUS_RING,
  FG_MUTED,
  HOVER_OVERLAY,
  HOVER_FG,
);

export const JAppShellView: React.FC<JAppShellViewProps> = ({
  brand, topbarEnd, sidebar, children, sidebarWidth, railWidth, collapsed, mobileOpen, navId, navLabel, openMenuLabel,
  closeMenuLabel, collapseLabel, drawerRef, openRef, onDrawerKeyDown, onOpenMobile, onCloseMobile, onToggleCollapse,
}) => (
  <div
    style={{ '--jona-shell-sidebar-w': sidebarWidth, '--jona-shell-rail-w': railWidth } as React.CSSProperties}
    className={cn('flex h-dvh min-h-0 w-full min-w-0 flex-col', SURFACE_MUTED, FG)}
  >
    <header
      role="banner"
      className={cn('flex h-[var(--jona-topbar-h)] shrink-0 items-center gap-2 border-b px-2 sm:px-4', LINE, SURFACE)}
    >
      <div className="flex lg:hidden">
        <button
          ref={openRef}
          type="button"
          aria-label={openMenuLabel}
          aria-expanded={mobileOpen}
          onClick={onOpenMobile}
          className={ICON_BUTTON}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      <div className={cn('flex min-w-0 flex-1 items-center truncate font-semibold', TEXT_BODY)}>{brand}</div>
      {topbarEnd && <div className="flex min-w-0 shrink-0 items-center gap-2">{topbarEnd}</div>}
    </header>

    <div className="relative flex min-h-0 flex-1">
      {mobileOpen && <div aria-hidden="true" className={cn('fixed inset-0 z-30 lg:hidden', BACKDROP)} />}
      <div
        ref={drawerRef}
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen ? true : undefined}
        aria-label={mobileOpen ? navLabel : undefined}
        tabIndex={mobileOpen ? -1 : undefined}
        onKeyDown={onDrawerKeyDown}
        className={cn(
          'fixed inset-y-0 start-0 z-40 flex w-[var(--jona-shell-sidebar-w)] max-w-[85vw] flex-col border-e transition-transform duration-200',
          'focus-visible:outline-none lg:visible lg:static lg:z-auto lg:max-w-none lg:translate-x-0',
          collapsed ? 'lg:w-[var(--jona-shell-rail-w)]' : 'lg:w-[var(--jona-shell-sidebar-w)]',
          mobileOpen ? 'visible translate-x-0 shadow-xl' : 'invisible -translate-x-full',
          LINE,
          SURFACE,
        )}
      >
        {mobileOpen && (
          <div className="flex shrink-0 justify-end p-1 lg:hidden">
            <button type="button" aria-label={closeMenuLabel} onClick={onCloseMobile} className={ICON_BUTTON}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <nav id={navId} aria-label={navLabel} className="flex min-h-0 flex-1 flex-col overflow-y-auto p-2">
          {sidebar({ close: onCloseMobile, collapsed: collapsed && !mobileOpen, mobileOpen })}
        </nav>
        <div className={cn('hidden shrink-0 border-t p-2 lg:flex', LINE, collapsed && 'justify-center')}>
          <button
            type="button"
            aria-label={collapseLabel}
            aria-expanded={!collapsed}
            aria-controls={navId}
            onClick={onToggleCollapse}
            className={ICON_BUTTON}
          >
            <svg
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </div>
      <main className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  </div>
);
