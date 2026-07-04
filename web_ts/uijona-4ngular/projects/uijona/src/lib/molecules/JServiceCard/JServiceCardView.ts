// JServiceCardView.ts — JONA View (template puro)
export const J_SERVICE_CARD_TEMPLATE = `
    <ng-template #body>
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2.5">
          @if (icon(); as i) {
            <span class="text-xl leading-none" aria-hidden="true">{{ i }}</span>
          }
          <h3 class="text-base font-bold text-neutral-900 group-hover:text-primary-700">{{ title() }}</h3>
        </div>
        @if (href()) {
          <span
            class="mt-0.5 shrink-0 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary-500"
            aria-hidden="true"
            >→</span
          >
        }
      </div>
      <p class="text-sm leading-relaxed text-neutral-600">{{ description() }}</p>
      @if (proof(); as p) {
        <p class="mt-auto border-t border-neutral-100 pt-3 text-xs leading-relaxed text-neutral-500">{{ p }}</p>
      }
    </ng-template>

    @if (href(); as link) {
      <a [href]="link" [class]="classes()"><ng-container [ngTemplateOutlet]="body" /></a>
    } @else {
      <div [class]="classes()"><ng-container [ngTemplateOutlet]="body" /></div>
    }
  `;

