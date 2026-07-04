// JComboBoxView.ts — JONA View (template puro)
export const J_COMBO_BOX_TEMPLATE = `
    <select
      [value]="value()"
      [disabled]="disabled()"
      [attr.id]="id() ?? null"
      [attr.name]="name() ?? null"
      [required]="required()"
      [attr.aria-invalid]="hasError() ? true : null"
      [attr.aria-describedby]="ariaDescribedby() ?? null"
      [attr.data-jcombobox-size]="size()"
      [attr.data-jcombobox-variant]="variant()"
      [attr.data-jcombobox-error]="hasError() ? 'true' : null"
      [class]="classes()"
      [style]="style()"
      (change)="onChangeEvent($event)"
      (focus)="focused.emit($event)"
      (blur)="onBlur($event)"
    >
      @if (placeholder(); as ph) {
        <option value="">{{ ph }}</option>
      }
      @if (groups(); as gs) {
        @for (g of gs; track g.label) {
          <optgroup [label]="g.label">
            @for (o of g.options; track o.value) {
              <option [value]="o.value" [disabled]="o.disabled">{{ o.label }}</option>
            }
          </optgroup>
        }
      } @else {
        @for (o of options() ?? []; track o.value) {
          <option [value]="o.value" [disabled]="o.disabled">{{ o.label }}</option>
        }
      }
    </select>
  `;
