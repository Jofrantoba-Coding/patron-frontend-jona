// JTextAreaView.ts — JONA View (template puro)
export const J_TEXT_AREA_TEMPLATE = `
    <textarea
      #el
      [value]="value()"
      [disabled]="disabled()"
      [attr.id]="id() ?? null"
      [attr.name]="name() ?? null"
      [attr.placeholder]="placeholder() ?? null"
      [required]="required()"
      [attr.rows]="rows() ?? null"
      [attr.maxlength]="maxLength() ?? null"
      [attr.aria-invalid]="hasError() ? true : null"
      [attr.data-jtextarea-size]="size()"
      [attr.data-jtextarea-variant]="variant()"
      [attr.data-jtextarea-resize]="resize()"
      [attr.data-jtextarea-error]="hasError() ? 'true' : null"
      [attr.data-jtextarea-autoresize]="autoResize() ? 'true' : null"
      [class]="classes()"
      [style]="style()"
      (input)="onInput($event)"
      (focus)="focused.emit($event)"
      (blur)="onBlur($event)"
      (keydown)="keydown.emit($event)"
    ></textarea>
  `;
