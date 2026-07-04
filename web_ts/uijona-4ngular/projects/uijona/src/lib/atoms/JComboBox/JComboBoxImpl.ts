import { J_COMBO_BOX_TEMPLATE } from './JComboBoxView';
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
import type { JStyle } from '../../core/types';
import {
  JCOMBOBOX_DEFAULTS,
  JCOMBOBOX_SIZE_CLASSES,
  JCOMBOBOX_VARIANT_CLASSES,
  type JComboBoxGroup,
  type JComboBoxOption,
  type JComboBoxSize,
  type JComboBoxVariant,
} from './InterJComboBox';

/**
 * JComboBox — select nativo con opciones planas o agrupadas. Implementa
 * ControlValueAccessor (`[(ngModel)]`, `formControl`, `[(value)]`).
 */
@Component({
  selector: 'j-combo-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JComboBox), multi: true },
  ],
  template: J_COMBO_BOX_TEMPLATE,
})
export class JComboBox implements ControlValueAccessor {
  readonly options = input<JComboBoxOption[]>();
  readonly groups = input<JComboBoxGroup[]>();
  readonly placeholder = input<string>();
  readonly value = model<string>('');
  readonly hasError = input<boolean>(JCOMBOBOX_DEFAULTS.hasError);
  readonly disabledInput = input<boolean>(JCOMBOBOX_DEFAULTS.disabled, { alias: 'disabled' });
  readonly size = input<JComboBoxSize>(JCOMBOBOX_DEFAULTS.size);
  readonly variant = input<JComboBoxVariant>(JCOMBOBOX_DEFAULTS.variant);
  readonly id = input<string>();
  readonly name = input<string>();
  readonly required = input<boolean>(false);
  readonly ariaDescribedby = input<string>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly focused = output<FocusEvent>();
  readonly blurred = output<{ value: string; event: FocusEvent }>();

  private readonly cvaDisabled = signal(false);
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  protected readonly classes = computed(() =>
    cn(
      'jcombobox',
      'w-full rounded-md border cursor-pointer',
      'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      'disabled:pointer-events-none disabled:opacity-50',
      JCOMBOBOX_SIZE_CLASSES[this.size()],
      JCOMBOBOX_VARIANT_CLASSES[this.variant()],
      this.hasError()
        ? 'border-danger-500 focus-visible:ring-danger-500'
        : 'focus-visible:ring-primary-500',
      this.className()
    )
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected onChangeEvent(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  protected onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit({ value: this.value(), event });
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────
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
