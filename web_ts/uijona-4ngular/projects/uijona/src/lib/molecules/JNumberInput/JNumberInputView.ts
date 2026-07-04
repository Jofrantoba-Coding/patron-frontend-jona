// JNumberInputView.ts — JONA View (template puro)
export const J_NUMBER_INPUT_TEMPLATE = `
    <div [class]="rootClasses()">
      <button
        type="button"
        aria-label="Decrement"
        [disabled]="disabled() || !canDecrement()"
        (click)="decrement()"
        class="inline-flex min-h-9 w-9 shrink-0 items-center justify-center border-r border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M5 12h14" />
        </svg>
      </button>
      <input
        type="number"
        [value]="displayValue()"
        [disabled]="disabled()"
        [attr.min]="min() ?? null"
        [attr.max]="max() ?? null"
        [attr.step]="step()"
        [attr.aria-invalid]="hasError() ? true : null"
        class="h-9 min-w-0 flex-1 border-0 bg-neutral-50 px-3 py-1 text-center text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
        (input)="onInput($event)"
        (blur)="onBlur($event)"
      />
      <button
        type="button"
        aria-label="Increment"
        [disabled]="disabled() || !canIncrement()"
        (click)="increment()"
        class="inline-flex min-h-9 w-9 shrink-0 items-center justify-center border-l border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 5v14" /><path d="M5 12h14" />
        </svg>
      </button>
    </div>
  `;

