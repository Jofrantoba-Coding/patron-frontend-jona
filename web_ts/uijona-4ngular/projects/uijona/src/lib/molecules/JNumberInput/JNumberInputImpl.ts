import { J_NUMBER_INPUT_TEMPLATE } from './JNumberInputView';
import type { InterJNumberInput } from './InterJNumberInput';
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

const clamp = (value: number, min?: number, max?: number): number => {
  let n = value;
  if (min !== undefined) n = Math.max(min, n);
  if (max !== undefined) n = Math.min(max, n);
  return n;
};

const parse = (value: string): number | null => {
  if (value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/**
 * JNumberInput — entrada numérica con stepper, min/max y clamp. Implementa CVA.
 */
@Component({
  selector: 'j-number-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JNumberInput), multi: true },
  ],
  template: J_NUMBER_INPUT_TEMPLATE,
})
export class JNumberInput implements ControlValueAccessor {
  readonly value = model<number | null>(null);
  readonly min = input<number>();
  readonly max = input<number>();
  readonly step = input<number>(1);
  readonly hasError = input<boolean>(false);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly className = input<string>('');

  readonly incremented = output<number>();
  readonly decremented = output<number>();

  private readonly cvaDisabled = signal(false);
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());
  protected readonly displayValue = computed(() => {
    const v = this.value();
    return v === null || v === undefined ? '' : String(v);
  });
  protected readonly canDecrement = computed(() => {
    const v = this.value();
    return v === null || this.min() === undefined || v > this.min()!;
  });
  protected readonly canIncrement = computed(() => {
    const v = this.value();
    return v === null || this.max() === undefined || v < this.max()!;
  });

  protected readonly rootClasses = computed(() =>
    cn(
      'inline-flex max-w-full min-w-0 items-stretch rounded-md border bg-white',
      this.hasError() ? 'border-danger-500' : 'border-neutral-300',
      this.className()
    )
  );

  private onChangeCb: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  protected onInput(event: Event): void {
    const parsed = parse((event.target as HTMLInputElement).value);
    const next = parsed === null ? null : clamp(parsed, this.min(), this.max());
    this.emit(next);
  }
  protected onBlur(event: Event): void {
    this.onTouched();
  }
  protected increment(): void {
    const next = clamp((this.value() ?? 0) + this.step(), this.min(), this.max());
    this.emit(next);
    this.incremented.emit(next);
  }
  protected decrement(): void {
    const next = clamp((this.value() ?? 0) - this.step(), this.min(), this.max());
    this.emit(next);
    this.decremented.emit(next);
  }
  private emit(next: number | null): void {
    this.value.set(next);
    this.onChangeCb(next);
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (value: number | null) => void): void {
    this.onChangeCb = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
