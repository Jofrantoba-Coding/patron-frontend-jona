// JEmptyStateView.ts — JONA View (template puro)
export const J_EMPTY_STATE_TEMPLATE = `
    <div [class]="classes()" [style]="style()">
      <div
        class="jempty-icon flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500"
      >
        <ng-content select="[jIcon]" />
      </div>
      <div class="flex max-w-md min-w-0 flex-col gap-1">
        <h3 class="break-words text-base font-semibold text-neutral-900">{{ title() }}</h3>
        @if (description(); as d) {
          <p class="break-words text-sm text-neutral-500">{{ d }}</p>
        }
      </div>
      @if (actions()?.length) {
        <div class="flex flex-wrap items-center justify-center gap-2">
          @for (action of actions(); track action.label) {
            <j-button
              type="button"
              [variant]="action.variant === 'secondary' ? 'outline' : 'default'"
              (clicked)="action.onClick()"
            >
              {{ action.label }}
            </j-button>
          }
        </div>
      }
    </div>
  `;

export const J_EMPTY_STATE_STYLES = [`.jempty-icon:empty { display: none; }`];

