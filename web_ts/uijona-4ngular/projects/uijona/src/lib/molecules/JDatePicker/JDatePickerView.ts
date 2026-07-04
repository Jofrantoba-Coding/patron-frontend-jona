// JDatePickerView.ts — JONA View (template puro)
export const J_DATE_PICKER_TEMPLATE = `
    <div [class]="cn('relative w-full', className())">
      <div #trigger [class]="triggerClasses()">
        <input
          type="text"
          [disabled]="disabled()"
          [value]="value()"
          [placeholder]="placeholder()"
          [attr.aria-label]="placeholder()"
          (input)="onInput($event)"
          class="min-w-0 flex-1 rounded-l-md border-0 bg-transparent px-3 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="button"
          [disabled]="disabled()"
          (click)="toggle()"
          aria-label="Abrir calendario"
          aria-haspopup="dialog"
          [attr.aria-expanded]="open()"
          class="flex h-full w-9 shrink-0 items-center justify-center rounded-r-md text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      @if (open()) {
        <div
          role="dialog"
          aria-label="Calendario"
          [style]="panelStyle()"
          class="z-50 w-80 max-w-[calc(100vw-16px)] rounded-lg border border-neutral-200 bg-white p-3 shadow-xl"
        >
          <div class="mb-2 flex flex-row items-center justify-between gap-2">
            <button
              type="button"
              (click)="prevMonth()"
              [disabled]="!canPrev()"
              aria-label="Mes anterior"
              class="flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span class="text-sm font-semibold text-neutral-900">{{ monthName() }} {{ viewYear() }}</span>
            <button
              type="button"
              (click)="nextMonth()"
              [disabled]="!canNext()"
              aria-label="Mes siguiente"
              class="flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          <div class="mb-1 grid grid-cols-7 text-center">
            @for (d of days; track d) {
              <span class="text-xs font-medium text-neutral-400">{{ d }}</span>
            }
          </div>

          <div class="grid grid-cols-7 gap-y-0.5">
            @for (cell of cells(); track $index) {
              @if (cell) {
                <button
                  type="button"
                  (click)="selectDay(cell)"
                  [disabled]="isDisabled(cell)"
                  [attr.aria-pressed]="isSelected(cell)"
                  [class]="dayClasses(cell)"
                >
                  {{ cell.getDate() }}
                </button>
              } @else {
                <span></span>
              }
            }
          </div>

          @if (showTime() || showSeconds()) {
            <div class="mt-3 border-t border-neutral-200 pt-3 flex flex-col gap-2">
              <div class="grid grid-cols-3 gap-2">
                <label class="flex flex-col gap-1 text-xs font-medium text-neutral-600">
                  HH
                  <input type="number" min="0" max="23" [value]="pad(timeParts().hour)" (input)="onTime('hour', $event)" [class]="timeInputClass" />
                </label>
                <label class="flex flex-col gap-1 text-xs font-medium text-neutral-600">
                  mm
                  <input type="number" min="0" max="59" [value]="pad(timeParts().minute)" (input)="onTime('minute', $event)" [class]="timeInputClass" />
                </label>
                @if (showSeconds()) {
                  <label class="flex flex-col gap-1 text-xs font-medium text-neutral-600">
                    ss
                    <input type="number" min="0" max="59" [value]="pad(timeParts().second)" (input)="onTime('second', $event)" [class]="timeInputClass" />
                  </label>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `;

