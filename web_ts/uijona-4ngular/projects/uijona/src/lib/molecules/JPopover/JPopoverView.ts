// JPopoverView.ts — JONA View (template puro)
export const J_POPOVER_TEMPLATE = `
    <div #trigger class="inline-block" (click)="toggle()">
      <ng-content select="[jTrigger]" />
    </div>
    @if (open()) {
      <div
        role="dialog"
        [style]="panelStyle()"
        [class]="cn('z-50 min-w-[12rem] max-w-[calc(100vw-1rem)] rounded-md border border-neutral-200 bg-white p-3 shadow-lg', className())"
      >
        <ng-content />
      </div>
    }
  `;

