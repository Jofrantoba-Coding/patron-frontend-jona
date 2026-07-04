// JNavbarView.ts — JONA View (template puro)
export const J_NAVBAR_TEMPLATE = `
    <header [class]="headerClasses()">
      <nav class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <div class="flex items-center"><ng-content select="[jBrand]" /></div>
        <div class="hidden items-center gap-1 lg:flex"><ng-content /></div>
        <div class="flex items-center gap-2">
          <ng-content select="[jActions]" />
          <button
            (click)="mobileOpen.set(!mobileOpen())"
            aria-label="Abrir menú"
            class="grid h-10 w-10 place-items-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="2" y1="6" x2="20" y2="6" /><line x1="2" y1="11" x2="20" y2="11" /><line x1="2" y1="16" x2="20" y2="16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>

    @if (mobileOpen()) {
      <div class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" (click)="mobileOpen.set(false)" aria-hidden="true"></div>
        <div class="absolute left-0 top-0 flex h-full w-[85vw] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
          <div class="flex h-16 shrink-0 items-center justify-end border-b border-neutral-200 px-5">
            <button (click)="mobileOpen.set(false)" aria-label="Cerrar menú" class="grid h-10 w-10 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="flex flex-col gap-6 p-5"><ng-content select="[jDrawer]" /></div>
        </div>
      </div>
    }
  `;

