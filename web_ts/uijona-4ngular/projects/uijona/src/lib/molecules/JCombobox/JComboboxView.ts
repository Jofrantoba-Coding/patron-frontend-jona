// JComboboxView.ts — JONA View (template puro)
export const J_COMBOBOX_TEMPLATE = `
    <div [class]="cn('relative inline-block w-full', className())">
      <button
        #trigger
        type="button"
        role="combobox"
        [attr.aria-expanded]="open()"
        aria-haspopup="listbox"
        [disabled]="disabled()"
        (click)="toggle()"
        (keydown)="onTriggerKeydown($event)"
        [class]="triggerClasses()"
      >
        <span [class]="cn('min-w-0 flex-1 truncate text-left', !selected() && 'text-neutral-400')">
          {{ selected() ? selected()!.label : placeholder() }}
        </span>
        <svg
          class="ml-2 h-4 w-4 shrink-0 text-neutral-400 transition-transform"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
          [style.transform]="open() ? 'rotate(180deg)' : null"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      @if (open()) {
        <div
          [style]="listStyle()"
          class="z-50 flex max-h-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg"
        >
          <div class="border-b border-neutral-100 p-2">
            <input
              #search
              type="text"
              [value]="query()"
              [placeholder]="searchPlaceholder()"
              [attr.aria-label]="searchPlaceholder()"
              (input)="onQuery($event)"
              (keydown)="onSearchKeydown($event)"
              class="h-8 w-full rounded border border-neutral-200 bg-white px-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div role="listbox" class="overflow-y-auto py-1">
            @if (filtered().length === 0) {
              <p class="px-3 py-4 text-center text-sm text-neutral-400">{{ emptyText() }}</p>
            } @else {
              @for (opt of filtered(); track opt.value; let i = $index) {
                <button
                  role="option"
                  type="button"
                  [attr.aria-selected]="selected()?.value === opt.value"
                  [disabled]="opt.disabled"
                  (click)="select(opt)"
                  [class]="optionClasses(opt, i)"
                >
                  <span class="min-w-0 flex-1 truncate">{{ opt.label }}</span>
                  @if (selected()?.value === opt.value) {
                    <svg class="h-4 w-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `;

