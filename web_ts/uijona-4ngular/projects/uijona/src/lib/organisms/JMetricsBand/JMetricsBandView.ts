// JMetricsBandView.ts — JONA View (template puro)
export const J_METRICS_BAND_TEMPLATE = `
    <section [class]="classes()">
      <div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div class="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
          @for (m of metrics(); track m.label) {
            <div class="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/5 px-6 py-5">
              <strong class="text-2xl font-black leading-none text-primary-400 sm:text-3xl">{{ m.value }}</strong>
              <span class="text-sm leading-relaxed text-neutral-400">{{ m.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `;

