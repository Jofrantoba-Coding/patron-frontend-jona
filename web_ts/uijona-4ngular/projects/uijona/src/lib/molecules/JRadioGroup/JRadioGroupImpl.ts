import { J_RADIO_GROUP_TEMPLATE } from './JRadioGroupView';
import type { JRadioGroupOption, InterJRadioGroup } from './InterJRadioGroup';
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
import { JRadioButton } from '../../atoms/JRadioButton';
/**
 * JRadioGroup — grupo de opciones radio con label, ayuda y error. Implementa CVA.
 */
@Component({
  selector: 'j-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JRadioButton],
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JRadioGroup), multi: true },
  ],
  template: J_RADIO_GROUP_TEMPLATE,
})
export class JRadioGroup implements ControlValueAccessor {
  readonly name = input.required<string>();
  readonly options = input.required<JRadioGroupOption[]>();
  readonly value = model<string>('');
  readonly label = input<string>();
  readonly errorMessage = input<string>();
  readonly description = input<string>();
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly className = input<string>('');

  readonly valueChanged = output<{ value: string; option: JRadioGroupOption }>();

  protected readonly cn = cn;
  private readonly cvaDisabled = signal(false);
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected onOptionChange(
    event: { checked: boolean; value: string; event: Event },
    option: JRadioGroupOption
  ): void {
    if (!event.checked) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.valueChanged.emit({ value: option.value, option });
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
