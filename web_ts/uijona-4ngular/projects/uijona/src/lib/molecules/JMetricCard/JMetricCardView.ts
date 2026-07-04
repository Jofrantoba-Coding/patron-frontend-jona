// JMetricCardView.ts — JONA View (template puro)
export const J_METRIC_CARD_TEMPLATE = `
    <div [class]="classes()">
      <strong class="text-2xl font-black leading-none text-neutral-900 sm:text-3xl">{{ value() }}</strong>
      <span class="text-sm leading-relaxed text-neutral-500">{{ label() }}</span>
    </div>
  `;

