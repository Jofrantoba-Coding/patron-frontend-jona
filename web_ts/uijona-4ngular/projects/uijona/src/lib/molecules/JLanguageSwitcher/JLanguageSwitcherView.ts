// JLanguageSwitcherView.ts — JONA View (template puro)
export const J_LANGUAGE_SWITCHER_TEMPLATE = `
    <div [class]="cn('relative inline-block', className())">
      <button
        type="button"
        [attr.aria-label]="ariaLabel()"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        (click)="toggle()"
        [class]="triggerClasses()"
      >
        <j-glyph size="sm" tone="muted">
          <svg:circle cx="12" cy="12" r="10" />
          <svg:path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
        </j-glyph>
        <span>{{ current().code }}</span>
        <j-glyph size="xs" tone="muted" [className]="cn('transition-transform duration-200', open() && 'rotate-180')">
          <svg:polyline points="6 9 12 15 18 9" />
        </j-glyph>
      </button>

      @if (open()) {
        <div
          role="listbox"
          [attr.aria-label]="ariaLabel()"
          class="absolute right-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-lg"
        >
          @for (l of languages(); track l.code) {
            <button
              type="button"
              role="option"
              [attr.aria-selected]="l.code === value()"
              (click)="select(l.code)"
              [class]="optionClasses(l.code)"
            >
              <span class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wide">{{ l.code }}</span>
                <span class="text-neutral-500">{{ l.label }}</span>
              </span>
              @if (l.code === value()) {
                <j-glyph size="xs" tone="primary" [strokeWidth]="3">
                  <svg:polyline points="20 6 9 17 4 12" />
                </j-glyph>
              }
            </button>
          }
        </div>
      }
    </div>
  `;

