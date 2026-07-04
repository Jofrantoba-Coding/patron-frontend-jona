// JSwitchView.ts — JONA View (template puro)
export const J_SWITCH_TEMPLATE = `
    <button
      type="button"
      role="switch"
      [attr.id]="id() ?? null"
      [attr.aria-checked]="checked()"
      [attr.aria-labelledby]="ariaLabelledby() ?? null"
      [attr.aria-label]="ariaLabel() ?? null"
      [disabled]="disabled()"
      [attr.data-jswitch-size]="size()"
      [attr.data-jswitch-error]="hasError() ? true : null"
      [class]="trackClasses()"
      [style]="style()"
      (click)="onClick($event)"
      (blur)="onTouched()"
    >
      <span [class]="thumbClasses()"></span>
    </button>
  `;
