import { J_SELECT_FIELD_TEMPLATE } from './JSelectFieldView';
import type { InterJSelectField } from './InterJSelectField';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';
import {
  JComboBox,
  type JComboBoxGroup,
  type JComboBoxOption,
} from '../../atoms/JComboBox';
import { JLabel } from '../../atoms/JLabel';
/**
 * JSelectField — select con label, ayuda y error. Implementa CVA.
 */
@Component({
  selector: 'j-select-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JComboBox, JLabel],
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JSelectField), multi: true },
  ],
  template: J_SELECT_FIELD_TEMPLATE,
})
export class JSelectField implements ControlValueAccessor {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input<JComboBoxOption[]>();
  readonly groups = input<JComboBoxGroup[]>();
  readonly placeholder = input<string>();
  readonly errorMessage = input<string>();
  readonly description = input<string>();
  readonly required = input<boolean>(false);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly value = model<string>('');
  readonly className = input<string>('');

  readonly changed = output<string>();

  protected readonly cn = cn;
  protected readonly hasError = computed(() => !!this.errorMessage());
  private cvaDisabled = signal(false);
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onValueChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
    this.changed.emit(value);
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
