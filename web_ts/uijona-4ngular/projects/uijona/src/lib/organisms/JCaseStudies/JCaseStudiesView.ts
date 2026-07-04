// JCaseStudiesView.ts — JONA View (template puro)
export const J_CASE_STUDIES_TEMPLATE = `
    <section [class]="cn('w-full bg-neutral-50 py-16 sm:py-20', className())">
      <div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <j-section-heading [eyebrow]="eyebrow()" [heading]="heading()" [description]="description()" className="mb-10" />
        <div class="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          @for (item of items(); track item.title) {
            @if (item.href) {
              <a [href]="item.href" [class]="cn(cardClass, 'no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500')">
                <ng-container [ngTemplateOutlet]="body" [ngTemplateOutletContext]="{ item }" />
              </a>
            } @else {
              <div [class]="cardClass">
                <ng-container [ngTemplateOutlet]="body" [ngTemplateOutletContext]="{ item }" />
              </div>
            }
          }
        </div>
      </div>
    </section>

    <ng-template #body let-item="item">
      @if (item.sector) {
        <span class="inline-flex w-fit rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">{{ item.sector }}</span>
      }
      <strong class="text-lg font-bold leading-snug text-neutral-900">{{ item.title }}</strong>
      <p class="text-sm leading-relaxed text-neutral-500">{{ item.outcome }}</p>
      @if (item.metrics?.length) {
        <div class="mt-auto grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
          @for (m of item.metrics; track m.label) {
            <div class="flex flex-col gap-0.5">
              <strong class="text-xl font-black leading-none text-neutral-900">{{ m.value }}</strong>
              <span class="text-xs leading-tight text-neutral-500">{{ m.label }}</span>
            </div>
          }
        </div>
      }
      @if (item.tags?.length) {
        <div class="flex flex-wrap gap-1.5">
          @for (t of item.tags; track t) {
            <span class="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">{{ t }}</span>
          }
        </div>
      }
      @if (item.href) {
        <span class="mt-1 text-sm font-semibold text-primary-600 group-hover:text-primary-700">{{ item.linkLabel ?? 'Ver caso →' }}</span>
      }
    </ng-template>
  `;

