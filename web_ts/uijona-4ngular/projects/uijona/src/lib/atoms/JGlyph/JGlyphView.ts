// JGlyphView.ts — JONA View (template puro)
export const J_GLYPH_TEMPLATE = `
    <svg
      [attr.viewBox]="viewBox()"
      [attr.width]="numericSize()"
      [attr.height]="numericSize()"
      [attr.fill]="filled() ? 'currentColor' : 'none'"
      [attr.stroke]="filled() ? null : 'currentColor'"
      [attr.stroke-width]="filled() ? null : strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.role]="ariaLabel() ? 'img' : null"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-hidden]="ariaLabel() ? null : true"
      [class]="classes()"
      [style]="style()"
    >
      <ng-content />
    </svg>
  `;
