// JMarketingCTAView.ts — JONA View (template puro)
export const J_MARKETING_CTA_TEMPLATE = `
    <section [class]="cn('w-full px-4 py-16 sm:px-6 sm:py-20', className())">
      <div class="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-12">
        <h2 class="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">{{ heading() }}</h2>
        @if (description(); as d) {
          <p class="max-w-prose text-base leading-relaxed text-neutral-600">{{ d }}</p>
        }
        <div class="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
          @if (primaryHref(); as ph) {
            <a [href]="ph" [class]="cn(linkBase, primaryCls, 'w-full sm:w-auto')">{{ primaryLabel() }}</a>
          } @else {
            <button type="button" (click)="primaryClick.emit()" [class]="cn(linkBase, primaryCls, 'w-full sm:w-auto')">{{ primaryLabel() }}</button>
          }
          @if (secondaryLabel()) {
            @if (secondaryHref(); as sh) {
              <a [href]="sh" [class]="cn(linkBase, secondaryCls, 'w-full sm:w-auto')">{{ secondaryLabel() }}</a>
            } @else {
              <button type="button" (click)="secondaryClick.emit()" [class]="cn(linkBase, secondaryCls, 'w-full sm:w-auto')">{{ secondaryLabel() }}</button>
            }
          }
        </div>
      </div>
    </section>
  `;

