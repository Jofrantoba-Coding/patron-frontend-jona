import { J_SWITCH_FIELD_TEMPLATE } from './JSwitchFieldView';
import type { InterJSwitchField } from './InterJSwitchField';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';
import { JLabel } from '../../atoms/JLabel';
import { JSwitch, type JSwitchSize } from '../../atoms/JSwitch';
/**
 * JSwitchField — switch con label, descripción y error. Modo `card` clicable.
 * Implementa CVA.
 */
@Component({
  selector: 'j-switch-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSwitch, JLabel, NgTemplateOutlet],
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JSwitchField), multi: true },
  ],
  template: J_SWITCH_FIELD_TEMPLATE,
})
export class JSwitchField implements ControlValueAccessor {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly checked = model<boolean>(false);
  readonly description = input<string>();
  readonly errorMessage = input<string>();
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly size = input<JSwitchSize>('md');
  readonly card = input<boolean>(false);
  readonly className = input<string>('');

  protected readonly cn = cn;
  protected readonly hasError = computed(() => !!this.errorMessage());
  private cvaDisabled = signal(false);
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  protected readonly cardClasses = computed(() =>
    cn(
      'cursor-pointer rounded-md border border-neutral-200 p-4 transition-colors duration-150 hover:bg-neutral-50',
      this.disabled() && 'pointer-events-none opacity-50',
      this.className()
    )
  );

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected onToggle(value: boolean): void {
    this.checked.set(value);
    this.onChange(value);
    this.onTouched();
  }

  protected onCardClick(): void {
    if (this.disabled()) return;
    this.onToggle(!this.checked());
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
