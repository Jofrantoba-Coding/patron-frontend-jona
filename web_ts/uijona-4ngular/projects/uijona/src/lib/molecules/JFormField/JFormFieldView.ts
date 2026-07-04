// JFormFieldView.ts — JONA View (template puro)
export const J_FORM_FIELD_TEMPLATE = `
    <div [class]="wrapperClasses()">
      <j-label
        variant="label"
        [htmlFor]="id()"
        [required]="required()"
        [message]="label()"
        [className]="orientation() === 'horizontal' ? 'sm:shrink-0' : ''"
      />
      <div
        [class]="cn('flex min-w-0 flex-col gap-1', orientation() === 'horizontal' && 'sm:flex-1')"
      >
        <j-text-box
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder() ?? ''"
          [hasError]="hasError()"
          [required]="required()"
          [ariaDescribedby]="describedBy()"
          [value]="value()"
          (valueChange)="onValueChange($event)"
          (focused)="focused.emit($event)"
          (blurred)="onBlur()"
          (enterPress)="enterPress.emit($event.value)"
        />
        @if (description() && !hasError()) {
          <j-label [id]="id() + '-desc'" [message]="description()!" variant="description" />
        }
        @if (hasError()) {
          <j-label [id]="id() + '-error'" [message]="errorMessage()!" variant="error" />
        }
      </div>
    </div>
  `;

