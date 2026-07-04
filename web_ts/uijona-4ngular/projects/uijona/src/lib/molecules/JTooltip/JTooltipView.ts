// JTooltipView.ts — JONA View (template puro)
export const J_TOOLTIP_TEMPLATE = `
    <span
      #trigger
      class="inline-flex"
      [attr.aria-describedby]="visible() ? tooltipId : null"
      (mouseenter)="show()"
      (mouseleave)="hide()"
      (focusin)="show()"
      (focusout)="hide()"
    >
      <ng-content />
    </span>
    @if (visible()) {
      <div
        [id]="tooltipId"
        role="tooltip"
        [style]="style()"
        [class]="cn('pointer-events-none select-none break-words rounded bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md', className())"
      >
        {{ content() }}
      </div>
    }
  `;

