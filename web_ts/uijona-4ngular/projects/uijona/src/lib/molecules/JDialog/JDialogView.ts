// JDialogView.ts — JONA View (template puro)
export const J_DIALOG_TEMPLATE = `
    @if (open()) {
      <div role="presentation" class="fixed inset-0 z-[1050] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" aria-hidden="true" (click)="requestClose('cancel')"></div>
        <div
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title() ? 'jdialog-title' : null"
          [attr.aria-describedby]="description() ? 'jdialog-desc' : null"
          tabindex="-1"
          [class]="panelClasses()"
        >
          <div [class]="cn('flex flex-row items-center bg-neutral-50 border-b border-neutral-200', titleBarClassName())">
            <span class="flex items-center pl-3 pr-1 py-3 shrink-0 text-neutral-500 jdialog-icon">
              <ng-content select="[jTitleIcon]" />
            </span>
            <div class="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-3 pl-1 pr-1">
              @if (title(); as t) {
                <h2 id="jdialog-title" class="truncate text-sm font-semibold text-neutral-900 leading-tight">{{ t }}</h2>
              }
              @if (description(); as d) {
                <p id="jdialog-desc" class="break-words text-xs text-neutral-500 leading-snug">{{ d }}</p>
              }
            </div>
            @if (showCloseButton()) {
              <span class="flex shrink-0 items-center px-2 py-2">
                <button
                  type="button"
                  aria-label="Close dialog"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  (click)="requestClose('cancel')"
                >
                  <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            }
          </div>

          <div [class]="cn('overflow-auto p-4 text-sm text-neutral-700', contentClassName())">
            <ng-content />
          </div>

          <div [class]="cn('jdialog-footer flex flex-wrap justify-end gap-2 px-4 py-3 bg-neutral-50 border-t border-neutral-200', footerClassName())">
            <ng-content select="[jFooter]" />
          </div>
        </div>
      </div>
    }
  `;

export const J_DIALOG_STYLES = [
    `
      .jdialog-icon:empty {
        display: none;
      }
      .jdialog-footer:empty {
        display: none;
      }
    `,
  ];

