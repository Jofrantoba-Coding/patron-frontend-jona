// JRadioButtonView.ts — JONA View (template puro)
export const J_RADIO_BUTTON_TEMPLATE = `
    @if (label(); as text) {
      <label [class]="wrapperClasses()">
        <ng-container [ngTemplateOutlet]="radio" />
        <span
          [class]="
            cn('text-sm text-neutral-700 select-none leading-none', disabled() && 'opacity-50', labelClassName())
          "
          >{{ text }}</span
        >
      </label>
    } @else {
      <ng-container [ngTemplateOutlet]="radio" />
    }

    <ng-template #radio>
      <input
        type="radio"
        [attr.id]="id() ?? null"
        [attr.name]="name() ?? null"
        [attr.value]="value()"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.data-jradiobutton-error]="hasError() ? true : null"
        [class]="radioClasses()"
        [style]="style()"
        (change)="onChangeEvent($event)"
        (focus)="focused.emit($event)"
        (blur)="blurred.emit($event)"
      />
    </ng-template>
  `;
