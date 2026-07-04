// JChipView.ts — JONA View (template puro)
export const J_CHIP_TEMPLATE = `
    <span
      [attr.id]="id() ?? null"
      [attr.data-jchip-variant]="variant()"
      [attr.data-jchip-selected]="effectiveSelected() ? true : null"
      [class]="classes()"
      [style]="style()"
      (click)="onClick($event)"
    >
      <ng-content />
      @if (removable()) {
        <button
          type="button"
          aria-label="Remove"
          class="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          (click)="onRemoveClick($event)"
        >
          ×
        </button>
      }
    </span>
  `;
