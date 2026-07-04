// JProgressItemView.ts — JONA View (template puro)
export const J_PROGRESS_ITEM_TEMPLATE = `
    <div [class]="classes()" [style]="style()">
      <div class="mb-2 flex items-center justify-between gap-2">
        <span [class]="cn('font-medium text-neutral-800 leading-snug', textSize())">{{ label() }}</span>
        @if (showValue()) {
          <span [class]="cn('shrink-0 tabular-nums font-semibold', textSize(), valueColor())">{{ pct() }}%</span>
        }
      </div>
      <j-progress [value]="value()" [max]="max()" [variant]="variant()" [size]="size()" />
    </div>
  `;

