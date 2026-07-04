// JHeroDynamicView.ts — JONA View (template puro)
export const J_HERO_DYNAMIC_TEMPLATE = `
    <section [class]="cn('w-full bg-neutral-900 px-4 py-16 sm:px-6 sm:py-20 lg:py-28', className())">
      <div [class]="cn('mx-auto grid w-full max-w-6xl gap-10', hasVisual() && 'lg:grid-cols-2 lg:items-center lg:gap-16')">
        <div class="flex min-w-0 flex-col gap-5">
          @if (eyebrow(); as e) {
            <span class="text-xs font-semibold uppercase tracking-wide text-primary-400">{{ e }}</span>
          }
          <h1 class="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {{ titlePrefix() }}
            <span aria-live="polite" class="inline-block">
              <span class="jhero-word bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">{{ word() }}</span>
            </span>
          </h1>
          @if (subtitle(); as s) {
            <p class="max-w-prose text-base leading-relaxed text-neutral-400 sm:text-lg">{{ s }}</p>
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
        </div>
        <div class="jhero-visual min-w-0"><ng-content select="[jVisual]" /></div>
      </div>
    </section>
  `;

export const J_HERO_DYNAMIC_STYLES = [`.jhero-visual:empty { display: none; }`];

