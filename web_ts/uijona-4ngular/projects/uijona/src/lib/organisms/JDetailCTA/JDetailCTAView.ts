// JDetailCTAView.ts — JONA View (template puro)
export const J_DETAIL_CTA_TEMPLATE = `
    <section [class]="cn('w-full bg-neutral-900 py-16 sm:py-20', className())">
      <div class="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div class="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center sm:p-12">
          <h2 class="text-2xl font-black tracking-tight text-white sm:text-3xl">{{ title() }}</h2>
          <p class="max-w-prose text-base leading-relaxed text-neutral-400">{{ body() }}</p>
          <div class="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <a [href]="primaryHref()" [class]="cn(ctaBase, 'bg-primary-600 text-white hover:bg-primary-700 w-full sm:w-auto')">
              {{ primaryLabel() }}
            </a>
            @if (secondaryHref() && secondaryLabel()) {
              <a [href]="secondaryHref()" [class]="cn(ctaBase, 'border border-white/20 text-neutral-200 hover:bg-white/10 w-full sm:w-auto')">
                {{ secondaryLabel() }}
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `;

