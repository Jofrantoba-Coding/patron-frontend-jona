// JRelatedItemView.ts — JONA View (template puro)
export const J_RELATED_ITEM_TEMPLATE = `
    <a [href]="href()" [class]="classes()">
      <strong class="text-base font-bold text-neutral-900">{{ name() }}</strong>
      <span class="text-sm leading-relaxed text-neutral-500">{{ outcome() }}</span>
      <span class="mt-1 text-sm font-semibold text-primary-600">{{ linkLabel() }}</span>
    </a>
  `;

