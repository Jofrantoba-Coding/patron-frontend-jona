// JTextBoxView.ts — JONA View (template puro)
export const J_TEXT_BOX_TEMPLATE = `
    <div
      class="jtextbox-root"
      [attr.data-jtextbox-variant]="variant()"
      [attr.data-jtextbox-size]="size()"
      [attr.data-jtextbox-error]="hasError() ? 'true' : null"
      [attr.data-jtextbox-has-icon-left]="hasIconLeft() ? 'true' : null"
      [attr.data-jtextbox-has-icon-right]="hasIconRight() ? 'true' : null"
      [style]="style()"
    >
      <span class="jtextbox-icon jtextbox-icon--left" aria-hidden="true">
        <ng-content select="[jIconLeft]" />
      </span>

      <input
        [type]="type()"
        [value]="value()"
        [attr.placeholder]="placeholder() ?? null"
        [attr.name]="name() ?? null"
        [attr.id]="id() ?? null"
        [disabled]="disabled()"
        [readOnly]="readOnly()"
        [required]="required()"
        [attr.autocomplete]="autoComplete() ?? null"
        [attr.maxlength]="maxLength() ?? null"
        [attr.minlength]="minLength() ?? null"
        [attr.pattern]="pattern() ?? null"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-describedby]="ariaDescribedby() ?? null"
        [attr.aria-invalid]="hasError() ? true : null"
        [class]="classes()"
        (input)="onInput($event)"
        (focus)="focused.emit($event)"
        (blur)="onBlur($event)"
        (keydown)="onKeydown($event)"
      />

      <span class="jtextbox-icon jtextbox-icon--right" aria-hidden="true">
        <ng-content select="[jIconRight]" />
      </span>
    </div>
  `;
