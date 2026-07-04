// JToastView.ts — JONA View (template puro)
export const J_TOAST_TEMPLATE = `
    <div role="status" aria-live="polite" [class]="classes()">
      <div class="min-w-0 flex-1">
        @if (title(); as t) {
          <span class="mb-1 block break-words text-sm font-semibold leading-none">{{ t }}</span>
        }
        <span class="block break-words text-sm leading-snug">{{ message() }}</span>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        (click)="dismiss.emit(id())"
        class="shrink-0 cursor-pointer rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  `;

