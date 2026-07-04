// JStatCardView.ts — JONA View (template puro)
export const J_STAT_CARD_TEMPLATE = `
    <div [class]="classes()">
      <div class="flex min-w-0 items-start justify-between gap-3">
        <div class="min-w-0">
          @if (valueFirst()) {
            <p class="break-words text-3xl font-black leading-none tracking-tight text-neutral-900 sm:text-4xl">{{ value() }}</p>
            <p class="mt-2 break-words text-sm leading-relaxed text-neutral-500">{{ label() }}</p>
          } @else {
            <p class="break-words text-sm font-medium text-neutral-500">{{ label() }}</p>
            <p class="mt-1 break-words text-2xl font-semibold leading-tight text-neutral-900">{{ value() }}</p>
          }
        </div>
        <div [class]="iconClasses()">
          <ng-content select="[jIcon]" />
        </div>
      </div>
      @if (description() || trendLabel()) {
        <div class="mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          @if (trendLabel(); as tl) {
            <span [class]="cn('font-medium', trendClass())">{{ tl }}</span>
          }
          @if (description(); as d) {
            <span class="break-words text-neutral-500">{{ d }}</span>
          }
        </div>
      }
    </div>
  `;

export const J_STAT_CARD_STYLES = [`.jstat-icon:empty { display: none; }`];

