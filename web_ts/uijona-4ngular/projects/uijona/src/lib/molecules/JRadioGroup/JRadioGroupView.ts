// JRadioGroupView.ts — JONA View (template puro)
export const J_RADIO_GROUP_TEMPLATE = `
    <fieldset [class]="cn('flex flex-col gap-2', className())" [disabled]="disabled()">
      @if (label(); as l) {
        <legend class="text-sm font-medium text-neutral-900">{{ l }}</legend>
      }
      @if (description(); as d) {
        <p class="text-sm text-neutral-500">{{ d }}</p>
      }
      <div
        role="radiogroup"
        [attr.aria-invalid]="errorMessage() ? true : null"
        [class]="cn('flex gap-3', orientation() === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')"
      >
        @for (option of options(); track option.value) {
          <label
            [for]="name() + '-' + option.value"
            [class]="
              cn('flex items-start gap-2 rounded-md', disabled() || option.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer')
            "
          >
            <j-radio-button
              [id]="name() + '-' + option.value"
              [name]="name()"
              [value]="option.value"
              [checked]="value() === option.value"
              [disabled]="!!(disabled() || option.disabled)"
              [hasError]="!!errorMessage()"
              className="mt-0.5"
              (checkedChange)="onOptionChange($event, option)"
            />
            <span class="flex flex-col gap-0.5">
              <span class="text-sm font-medium text-neutral-900">{{ option.label }}</span>
              @if (option.description) {
                <span class="text-sm text-neutral-500">{{ option.description }}</span>
              }
            </span>
          </label>
        }
      </div>
      @if (errorMessage(); as e) {
        <p class="text-sm text-danger-500">{{ e }}</p>
      }
    </fieldset>
  `;

