// JLogoMarqueeView.ts — JONA View (template puro)
export const J_LOGO_MARQUEE_TEMPLATE = `
    <section [class]="cn('w-full py-10', className())">
      @if (label(); as l) {
        <p class="mb-6 text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">{{ l }}</p>
      }
      <div class="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div [class]="trackClasses()">
          @for (item of doubled(); track $index) {
            <div class="flex shrink-0 items-center text-neutral-400 grayscale transition-colors" [attr.aria-hidden]="$index >= items().length ? true : null">
              {{ item }}
            </div>
          }
        </div>
      </div>
    </section>
  `;

