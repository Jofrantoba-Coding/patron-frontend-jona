// JCheckBoxView.ts — JONA View (template puro)
export const J_CHECK_BOX_TEMPLATE = `
    @if (label(); as text) {
      <label [class]="wrapperClasses()">
        <ng-container [ngTemplateOutlet]="box" />
        <span
          [class]="
            cn('text-sm text-neutral-700 select-none leading-none', disabled() && 'opacity-50', labelClassName())
          "
          >{{ text }}</span
        >
      </label>
    } @else {
      <ng-container [ngTemplateOutlet]="box" />
    }

    <ng-template #box>
      <input
        #el
        type="checkbox"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.id]="id() ?? null"
        [attr.name]="name() ?? null"
        [attr.value]="value() ?? null"
        [attr.data-jcheckbox-size]="size()"
        [attr.data-jcheckbox-error]="hasError() ? 'true' : null"
        [attr.data-jcheckbox-indeterminate]="showIndeterminate() ? 'true' : null"
        [class]="boxClasses()"
        [style]="style()"
        (change)="onChangeEvent($event)"
        (focus)="focused.emit($event)"
        (blur)="onBlur($event)"
      />
    </ng-template>
  `;
