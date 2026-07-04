// JSidebarLayoutView.ts — JONA View (template puro)
export const J_SIDEBAR_LAYOUT_TEMPLATE = `
    <div [class]="cn('flex min-h-screen flex-row bg-neutral-50', className())">
      @if (mobileOpen()) {
        <div class="fixed inset-0 z-30 bg-black/40 lg:hidden" aria-hidden="true" (click)="mobileOpen.set(false)"></div>
      }

      <aside [style.width]="effectiveWidth()" [class]="sidebarClasses()">
        <div class="jsidebar-header shrink-0 border-b border-neutral-100 px-3 py-3" [class.flex]="true" [class.items-center]="true" [class.justify-center]="collapsed()">
          <ng-content select="[jHeader]" />
        </div>

        <nav class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
          @for (group of nav(); track $index) {
            <div class="flex flex-col">
              @if (group.label && !collapsed()) {
                <p class="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{{ group.label }}</p>
              }
              @for (item of group.items; track item.key) {
                <button
                  type="button"
                  (click)="onItemClick(item)"
                  [attr.aria-current]="item.key === activeKey() ? 'page' : null"
                  [attr.title]="collapsed() ? item.label : null"
                  [class]="itemClasses(item)"
                >
                  @if (item.icon) {
                    <span class="shrink-0" aria-hidden="true">{{ item.icon }}</span>
                  }
                  @if (!collapsed()) {
                    <span class="min-w-0 flex-1 truncate text-left">{{ item.label }}</span>
                  }
                  @if (!collapsed() && item.badge !== undefined) {
                    <span class="ml-auto shrink-0 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700">{{ item.badge }}</span>
                  }
                </button>
              }
            </div>
          }
        </nav>

        <div class="flex shrink-0 flex-col gap-1 border-t border-neutral-100 p-2">
          @if (!collapsed()) {
            <div class="jsidebar-footer min-w-0 px-1 py-1"><ng-content select="[jFooter]" /></div>
          }
          @if (collapsible()) {
            <button
              type="button"
              (click)="collapsed.set(!collapsed())"
              [attr.aria-label]="collapsed() ? 'Expandir sidebar' : 'Colapsar sidebar'"
              [class]="cn('flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500', collapsed() && 'justify-center')"
            >
              <svg [class]="cn('h-4 w-4 shrink-0 transition-transform', collapsed() && 'rotate-180')" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              @if (!collapsed()) {
                <span>Colapsar</span>
              }
            </button>
          }
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div class="flex shrink-0 flex-row items-center border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            (click)="mobileOpen.set(!mobileOpen())"
            aria-label="Abrir menú"
            [attr.aria-expanded]="mobileOpen()"
            class="mr-3 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
        <main class="flex min-h-0 flex-1 flex-col overflow-auto p-4 sm:p-6">
          <ng-content />
        </main>
      </div>
    </div>
  `;
