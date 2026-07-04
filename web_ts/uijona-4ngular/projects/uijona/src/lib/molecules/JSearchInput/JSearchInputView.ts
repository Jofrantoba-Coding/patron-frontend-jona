// JSearchInputView.ts — JONA View (template puro)
export const J_SEARCH_INPUT_TEMPLATE = `
    <div [class]="cn('flex w-full min-w-0 items-center gap-2', containerClassName())">
      <div class="relative min-w-0 flex-1">
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          @if (loading()) {
            <j-spinner size="sm" />
          } @else {
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          }
        </span>
        <input
          type="search"
          role="searchbox"
          [value]="value()"
          [disabled]="disabled()"
          [attr.placeholder]="placeholder()"
          [attr.aria-label]="placeholder()"
          [class]="inputClasses()"
          (input)="onInput($event)"
          (blur)="onBlur($event)"
          (keydown)="onKeydown($event)"
        />
        @if (clearable() && value() && !disabled()) {
          <button
            type="button"
            aria-label="Clear search"
            (click)="onClear()"
            class="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        }
      </div>
      <button
        type="button"
        [disabled]="disabled()"
        (click)="onSearchClick()"
        class="inline-flex min-h-9 shrink-0 items-center justify-center rounded-md bg-primary-600 px-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
      >
        Search
      </button>
    </div>
  `;

