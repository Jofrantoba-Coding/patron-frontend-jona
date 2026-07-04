// JDetailHeroView.ts — JONA View (template puro)
export const J_DETAIL_HERO_TEMPLATE = `
    <section [class]="cn('w-full bg-neutral-900 py-14 sm:py-16', className())">
      <div [class]="cn('mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6', hasVisual() && 'md:grid-cols-[1fr_auto] md:items-center md:gap-12')">
        <a
          [href]="backHref()"
          class="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:col-span-full"
          >{{ backLabel() }}</a
        >
        <div class="min-w-0 max-w-2xl">
          @if (eyebrow(); as e) {
            <span class="text-xs font-semibold uppercase tracking-wide text-primary-400">{{ e }}</span>
          }
          <h1 class="mt-2 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{{ title() }}</h1>
          <p class="mt-4 max-w-xl text-base leading-relaxed text-neutral-400">{{ outcome() }}</p>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a [href]="primaryHref()" [class]="cn(ctaBase, 'bg-primary-600 text-white hover:bg-primary-700')">{{ primaryLabel() }}</a>
            @if (secondaryHref() && secondaryLabel()) {
              <a [href]="secondaryHref()" [class]="cn(ctaBase, 'border border-white/20 text-neutral-200 hover:bg-white/10')">{{ secondaryLabel() }}</a>
            }
          </div>
        </div>
        <div class="jhero-visual min-w-0"><ng-content select="[jVisual]" /></div>
      </div>
    </section>
  `;

export const J_DETAIL_HERO_STYLES = [`.jhero-visual:empty { display: none; }`];

