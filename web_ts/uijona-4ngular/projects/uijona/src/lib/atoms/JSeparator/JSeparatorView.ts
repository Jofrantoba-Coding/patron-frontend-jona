// JSeparatorView.ts — JONA View (template puro)
export const J_SEPARATOR_TEMPLATE = `
    <div
      role="separator"
      [attr.aria-orientation]="orientation()"
      [attr.data-jseparator-orientation]="orientation()"
      [style]="style()"
      [class]="classes()"
    ></div>
  `;
