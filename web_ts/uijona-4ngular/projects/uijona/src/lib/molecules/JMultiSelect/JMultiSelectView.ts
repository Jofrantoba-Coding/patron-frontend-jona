// JMultiSelectView.ts — JONA View (template puro)
export const J_MULTI_SELECT_TEMPLATE = `
    <div [class]="cn('relative w-full', className())">
      <div
        #trigger
        role="combobox"
        [attr.aria-expanded]="open()"
        aria-haspopup="listbox"
        [attr.aria-disabled]="disabled()"
        (click)="!disabled() && toggle()"
        [class]="triggerClasses()"
      >
        @for (opt of selected(); track opt.value) {
          <span class="inline-flex items-center gap-1 rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700">
            {{ opt.label }}
            <button
              type="button"
              [attr.aria-label]="'Quitar ' + opt.label"
              (click)="onRemove($event, opt.value)"
              class="ml-0.5 rounded hover:text-primary-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
            >
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </span>
        }
        @if (selected().length === 0) {
          <span class="text-neutral-400">{{ placeholder() }}</span>
        }
        <svg
          class="ml-auto h-4 w-4 shrink-0 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
          [style.transform]="open() ? 'rotate(180deg)' : null"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

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
              (input)="query.set($any($event.target).value)"
              (keydown.escape)="close()"
              class="h-8 w-full rounded border border-neutral-200 bg-white px-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          @if (atMax()) {
            <p class="px-3 py-1.5 text-xs text-neutral-400">Máximo {{ maxSelected() }} seleccionados</p>
          }
          <div role="listbox" aria-multiselectable="true" class="overflow-y-auto py-1">
            @if (filtered().length === 0) {
              <p class="px-3 py-4 text-center text-sm text-neutral-400">{{ emptyText() }}</p>
            } @else {
              @for (opt of filtered(); track opt.value) {
                <button
                  role="option"
                  type="button"
                  [attr.aria-selected]="isSelected(opt.value)"
                  [disabled]="isDisabled(opt)"
                  (click)="toggleOption(opt)"
                  [class]="optionClasses(opt)"
                >
                  <span [class]="checkboxClasses(opt.value)">
                    @if (isSelected(opt.value)) {
                      <svg class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    }
                  </span>
                  <span class="min-w-0 flex-1 truncate">{{ opt.label }}</span>
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `;

