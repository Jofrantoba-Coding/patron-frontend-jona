// JNumberedStepView.ts — JONA View (template puro)
export const J_NUMBERED_STEP_TEMPLATE = `
    <div [class]="classes()">
      <span
        class="inline-grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary-200 bg-primary-50 text-sm font-black text-primary-700"
        >{{ num() }}</span
      >
      <div class="flex min-w-0 flex-col gap-1.5">
        <strong class="text-base font-bold text-neutral-900">{{ title() }}</strong>
        <p class="text-sm leading-relaxed text-neutral-500">{{ body() }}</p>
      </div>
    </div>
  `;

