// JDropdownView.ts — JONA View (template puro)
export const J_DROPDOWN_TEMPLATE = `
    <div class="jdropdown-trigger inline-block" (click)="toggle()">
      <ng-content select="[jTrigger]" />
    </div>
    @if (open()) {
      <div
        role="menu"
        [style]="menuStyle()"
        [class]="cn('max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg', className())"
      >
        @for (group of groups(); track $index; let gi = $index) {
          @if (gi > 0) {
            <j-separator className="my-1" />
          }
          @if (group.label) {
            <p class="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">{{ group.label }}</p>
          }
          @for (item of group.items; track item.label) {
            <button
              type="button"
              role="menuitem"
              [attr.aria-disabled]="item.disabled ? true : null"
              (click)="onItemClick(item)"
              [class]="itemClasses(item)"
            >
              @if (item.icon) {
                <span class="h-4 w-4 shrink-0" aria-hidden="true">{{ item.icon }}</span>
              }
              <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
              @if (item.shortcut) {
                <span class="ml-auto shrink-0 text-xs text-neutral-400">{{ item.shortcut }}</span>
              }
            </button>
          }
        }
      </div>
    }
  `;

