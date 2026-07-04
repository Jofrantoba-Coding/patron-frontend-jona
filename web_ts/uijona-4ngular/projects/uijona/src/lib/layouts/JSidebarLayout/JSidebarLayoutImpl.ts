import { J_SIDEBAR_LAYOUT_TEMPLATE } from './JSidebarLayoutView';
import type { InterJSidebarLayout, SidebarNavItem, SidebarNavGroup } from './InterJSidebarLayout';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JSidebarLayout — layout con sidebar navegable, colapsable y overlay móvil.
 */
@Component({
  selector: 'j-sidebar-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_SIDEBAR_LAYOUT_TEMPLATE,
  styles: [`.jsidebar-header:empty { display: none; } .jsidebar-footer:empty { display: none; }`],
})
export class JSidebarLayout {
  readonly nav = input.required<SidebarNavGroup[]>();
  readonly activeKey = input<string>();
  readonly collapsible = input<boolean>(true);
  readonly defaultCollapsed = input<boolean>(false);
  readonly sidebarWidth = input<string>('16rem');
  readonly className = input<string>('');
  readonly sidebarClassName = input<string>('');

  readonly navItemClick = output<SidebarNavItem>();

  protected readonly cn = cn;
  protected readonly collapsed = signal(false);
  protected readonly mobileOpen = signal(false);

  constructor() {
    // inicializa colapsado según defaultCollapsed
    queueMicrotask(() => this.collapsed.set(this.defaultCollapsed()));
  }

  protected readonly effectiveWidth = computed(() =>
    this.collapsed() ? '3.5rem' : this.sidebarWidth()
  );

  protected readonly sidebarClasses = computed(() =>
    cn(
      'fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out',
      'lg:static lg:z-auto',
      this.mobileOpen() ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0',
      this.sidebarClassName()
    )
  );

  protected itemClasses(item: SidebarNavItem): string {
    const isActive = item.key === this.activeKey();
    return cn(
      'flex min-w-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
      isActive
        ? 'bg-primary-50 text-primary-700'
        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
    );
  }

  protected onItemClick(item: SidebarNavItem): void {
    item.onClick?.();
    this.navItemClick.emit(item);
    this.mobileOpen.set(false);
  }
}
