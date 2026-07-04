// JCheckBoxFieldView.ts — JONA View (template puro)
export const J_CHECK_BOX_FIELD_TEMPLATE = `
    <div [class]="cn('flex flex-col gap-1', className())">
      <div class="flex items-start gap-2">
        <j-check-box
          [id]="id()"
          [checked]="checked()"
          [disabled]="disabled()"
          [hasError]="hasError()"
          [ariaLabel]="label()"
          (checkedChange)="onCheckedChange($event)"
        />
        <div class="flex flex-col gap-0.5">
          <j-label variant="label" [htmlFor]="id()" [message]="label()" className="cursor-pointer leading-tight" />
          @if (description() && !hasError()) {
            <j-label [message]="description()!" variant="description" />
          }
        </div>
      </div>
      @if (hasError()) {
        <j-label [message]="errorMessage()!" variant="error" />
      }
    </div>
  `;

