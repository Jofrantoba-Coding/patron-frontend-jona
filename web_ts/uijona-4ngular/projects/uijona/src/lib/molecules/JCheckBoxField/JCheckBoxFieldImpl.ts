import { J_CHECK_BOX_FIELD_TEMPLATE } from './JCheckBoxFieldView';
import type { InterJCheckBoxField } from './InterJCheckBoxField';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';
import { JCheckBox } from '../../atoms/JCheckBox';
import { JLabel } from '../../atoms/JLabel';
/**
 * JCheckBoxField — checkbox con label, descripción y error. Implementa CVA.
 */
@Component({
  selector: 'j-check-box-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JCheckBox, JLabel],
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JCheckBoxField), multi: true },
  ],
  template: J_CHECK_BOX_FIELD_TEMPLATE,
})
export class JCheckBoxField implements ControlValueAccessor {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly checked = model<boolean>(false);
  readonly description = input<string>();
  readonly errorMessage = input<string>();
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly className = input<string>('');

  protected readonly cn = cn;
  protected readonly hasError = computed(() => !!this.errorMessage());
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());
  private cvaDisabled = signal(false);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected onCheckedChange(value: boolean): void {
    this.checked.set(value);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
