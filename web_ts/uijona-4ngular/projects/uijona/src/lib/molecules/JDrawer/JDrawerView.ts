// JDrawerView.ts — JONA View (template puro)
export const J_DRAWER_TEMPLATE = `
    <div
      aria-hidden="true"
      (click)="closed.emit()"
      [class]="
        cn('fixed inset-0 z-40 bg-black/50 transition-opacity duration-300', open() ? 'opacity-100' : 'opacity-0 pointer-events-none')
      "
    ></div>
    <div
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="title() ? 'drawer-title' : null"
      [attr.aria-describedby]="description() ? 'drawer-desc' : null"
      [class]="panelClasses()"
    >
      @if (title() || showCloseButton()) {
        <div class="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 p-4 sm:p-5">
          <div class="flex min-w-0 flex-col gap-0.5">
            @if (title(); as t) {
              <h2 id="drawer-title" class="break-words text-base font-semibold text-neutral-900">{{ t }}</h2>
            }
            @if (description(); as d) {
              <p id="drawer-desc" class="break-words text-sm text-neutral-500">{{ d }}</p>
            }
          </div>
          @if (showCloseButton()) {
            <button
              type="button"
              aria-label="Cerrar panel"
              class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              (click)="closed.emit()"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          }
        </div>
      }
      <div [class]="cn('min-h-0 flex-1 overflow-y-auto p-4 sm:p-5', !isHorizontal() && 'overflow-x-auto')">
        <ng-content />
      </div>
      <div class="jdrawer-footer flex shrink-0 flex-col-reverse gap-2 border-t border-neutral-200 p-4 sm:flex-row sm:justify-end sm:p-5">
        <ng-content select="[jFooter]" />
      </div>
    </div>
  `;

export const J_DRAWER_STYLES = [`.jdrawer-footer:empty { display: none; }`];

