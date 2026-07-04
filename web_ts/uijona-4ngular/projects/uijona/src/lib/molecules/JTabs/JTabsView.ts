// JTabsView.ts — JONA View (template puro)
export const J_TABS_TEMPLATE_1 = `<div [class]="classes()"><ng-content /></div>`;

export const J_TABS_TEMPLATE_2 = `
    <div role="tablist" [attr.aria-orientation]="tabs.orientation()" [class]="classes()">
      <ng-content />
    </div>
  `;

export const J_TABS_TEMPLATE_3 = `
    <button
      role="tab"
      type="button"
      [attr.aria-selected]="isActive()"
      [disabled]="disabled()"
      [class]="classes()"
      (click)="onClick()"
      (focus)="tabs.tabFocus.emit(value())"
    >
      <ng-content />
    </button>
  `;

export const J_TABS_TEMPLATE_4 = `
    @if (tabs.value() === value()) {
      <div
        role="tabpanel"
        tabindex="0"
        [class]="cn('min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500', className())"
      >
        <ng-content />
      </div>
    }
  `;

