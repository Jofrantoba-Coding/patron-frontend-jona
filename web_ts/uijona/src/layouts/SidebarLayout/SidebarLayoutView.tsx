// SidebarLayoutView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterSidebarLayout, SidebarNavItem, SidebarNavGroup } from './InterSidebarLayout';

interface SidebarLayoutViewProps extends Omit<InterSidebarLayout, 'defaultCollapsed' | 'collapsible'> {
  collapsed: boolean;
  mobileOpen: boolean;
  collapsible: boolean;
  onToggleCollapse: () => void;
  onToggleMobile: () => void;
  onCloseMobile: () => void;
  onItemClick: (item: SidebarNavItem) => void;
}

function NavGroup({ group, activeKey, collapsed, onItemClick }: {
  group: SidebarNavGroup;
  activeKey?: string;
  collapsed: boolean;
  onItemClick: (item: SidebarNavItem) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {group.label && !collapsed && (
        <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{group.label}</p>
      )}
      {group.items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onItemClick(item)}
            aria-current={isActive ? 'page' : undefined}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex min-w-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            )}
          >
            {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
            {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
            {!collapsed && item.badge !== undefined && (
              <span className="ml-auto shrink-0 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const SidebarLayoutView: React.FC<SidebarLayoutViewProps> = ({
  nav, header, footer, children, activeKey, collapsible, collapsed, mobileOpen,
  sidebarWidth = '16rem', className, sidebarClassName,
  onToggleCollapse, onToggleMobile, onCloseMobile, onItemClick,
}) => {
  const effectiveWidth = collapsed ? '3.5rem' : sidebarWidth;

  return (
    <div className={cn('flex min-h-screen min-w-0 bg-neutral-50', className)}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" aria-hidden="true" onClick={onCloseMobile} />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: effectiveWidth }}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out',
          'lg:static lg:z-auto',
          mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0',
          sidebarClassName
        )}
      >
        {/* Sidebar header slot */}
        {header && (
          <div className={cn('flex shrink-0 items-center border-b border-neutral-100 px-3 py-3', collapsed && 'justify-center')}>
            {header}
          </div>
        )}

        {/* Nav */}
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
          {nav.map((group, i) => (
            <NavGroup key={i} group={group} activeKey={activeKey} collapsed={collapsed} onItemClick={onItemClick} />
          ))}
        </nav>

        {/* Footer slot + collapse toggle */}
        <div className="flex shrink-0 flex-col border-t border-neutral-100 p-2 gap-1">
          {footer && !collapsed && (
            <div className="min-w-0 px-1 py-1">{footer}</div>
          )}
          {collapsible && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                collapsed && 'justify-center'
              )}
            >
              <svg className={cn('h-4 w-4 shrink-0 transition-transform', collapsed && 'rotate-180')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {!collapsed && <span>Colapsar</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar with hamburger */}
        <div className="flex shrink-0 items-center border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={onToggleMobile}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            className="mr-3 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
