// JFaqItemView.ts — JONA View (template puro)
export const J_FAQ_ITEM_TEMPLATE = `
    <div [class]="classes()">
      <strong class="mb-2 block text-base font-bold text-neutral-900">{{ question() }}</strong>
      <p class="text-sm leading-relaxed text-neutral-600">{{ answer() }}</p>
    </div>
  `;

