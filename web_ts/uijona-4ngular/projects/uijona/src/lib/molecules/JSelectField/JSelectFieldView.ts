// JSelectFieldView.ts — JONA View (template puro)
export const J_SELECT_FIELD_TEMPLATE = `
    <div [class]="cn('flex flex-col gap-1.5', className())">
      <j-label variant="label" [htmlFor]="id()" [required]="required()" [message]="label()" />
      <j-combo-box
        [id]="id()"
        [options]="options()"
        [groups]="groups()"
        [placeholder]="placeholder() ?? ''"
        [hasError]="hasError()"
        [required]="required()"
        [disabled]="disabled()"
        [ariaDescribedby]="description() ? id() + '-desc' : undefined"
        [value]="value()"
        (valueChange)="onValueChange($event)"
        (blurred)="onTouched()"
      />
      @if (description() && !hasError()) {
        <j-label [id]="id() + '-desc'" [message]="description()!" variant="description" />
      }
      @if (hasError()) {
        <j-label [message]="errorMessage()!" variant="error" />
      }
    </div>
  `;

