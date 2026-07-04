// JMarketingHeroView.ts — JONA View (template puro)
export const J_MARKETING_HERO_TEMPLATE = `
    <section [class]="cn('w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-24', className())">
      <div [class]="cn('mx-auto grid w-full max-w-6xl gap-10', hasVisual() && 'lg:grid-cols-2 lg:items-center lg:gap-16')">
        <div class="flex min-w-0 flex-col gap-5">
          @if (eyebrow(); as e) {
            <span class="text-xs font-semibold uppercase tracking-wide text-primary-600">{{ e }}</span>
          }
          <h1 class="text-3xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">{{ title() }}</h1>
          @if (subtitle(); as s) {
            <p class="max-w-prose text-base leading-relaxed text-neutral-600 sm:text-lg">{{ s }}</p>
          }
          @if (ctas()?.length) {
            <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              @for (cta of ctas(); track cta.label) {
                @if (cta.href) {
                  <a [href]="cta.href" [class]="ctaClass(cta)">{{ cta.label }}</a>
                } @else {
                  <button type="button" (click)="cta.onClick && cta.onClick()" [class]="ctaClass(cta)">{{ cta.label }}</button>
                }
              }
            </div>
          }
          <div class="jhero-metrics mt-2"><ng-content select="[jMetrics]" /></div>
        </div>
        <div class="jhero-visual min-w-0"><ng-content select="[jVisual]" /></div>
      </div>
    </section>
  `;

export const J_MARKETING_HERO_STYLES = [`.jhero-metrics:empty { display: none; } .jhero-visual:empty { display: none; }`];

