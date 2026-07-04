// JSpinnerView.ts — JONA View (template puro)
export const J_SPINNER_TEMPLATE = `
    <span
      role="status"
      [attr.aria-label]="label()"
      [attr.data-jspinner-size]="size()"
      [attr.data-jspinner-color]="color()"
      [style]="style()"
      [class]="classes()"
    ></span>
  `;
