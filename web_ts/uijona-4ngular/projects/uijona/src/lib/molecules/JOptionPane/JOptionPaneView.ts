// JOptionPaneView.ts — JONA View (template puro)
export const J_OPTION_PANE_TEMPLATE = `
    @if (open()) {
      <div class="fixed inset-0 z-[1050] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" aria-hidden="true" (click)="cancel.emit()"></div>
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="joptionpane-title"
          [attr.aria-describedby]="description() ? 'joptionpane-desc' : null"
          class="relative z-10 w-full max-w-sm rounded-lg bg-white shadow-xl sm:max-w-md sm:flex sm:items-start"
        >
          <div class="flex justify-center pt-5 pb-3 sm:pl-5 sm:pr-3 sm:pb-0">
            <div [class]="cn('flex h-10 w-10 items-center justify-center rounded-full', iconBg())">
              <svg [class]="cn('h-6 w-6', iconColor())" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="iconPath()" />
              </svg>
            </div>
          </div>
          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex min-w-0 flex-col gap-1 px-5 pb-4 text-center sm:px-0 sm:pt-5 sm:pr-5 sm:text-left">
              <h2 id="joptionpane-title" class="break-words text-base font-semibold text-neutral-900">{{ title() }}</h2>
              @if (description(); as d) {
                <p id="joptionpane-desc" class="break-words text-sm text-neutral-500">{{ d }}</p>
              }
            </div>
            <div class="flex flex-wrap justify-center gap-2 px-5 pb-5 sm:justify-end">
              <j-button [variant]="confirmVariant()" [loading]="isLoading()" (clicked)="confirm.emit()">
                {{ confirmLabel() }}
              </j-button>
              <j-button variant="outline" [disabled]="isLoading()" (clicked)="cancel.emit()">
                {{ cancelLabel() }}
              </j-button>
            </div>
          </div>
        </div>
      </div>
    }
  `;

