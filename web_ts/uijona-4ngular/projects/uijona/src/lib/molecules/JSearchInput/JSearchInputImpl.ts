import { J_SEARCH_INPUT_TEMPLATE } from './JSearchInputView';
import type { InterJSearchInput } from './InterJSearchInput';
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
import { JSpinner } from '../../atoms/JSpinner';
/**
 * JSearchInput — búsqueda con icono, clear, loading y submit por Enter/botón.
 * Implementa CVA.
 */
@Component({
  selector: 'j-search-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSpinner],
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JSearchInput), multi: true },
  ],
  template: J_SEARCH_INPUT_TEMPLATE,
})
export class JSearchInput implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly placeholder = input<string>('Search');
  readonly clearable = input<boolean>(true);
  readonly loading = input<boolean>(false);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly className = input<string>('');
  readonly containerClassName = input<string>('');

  readonly search = output<string>();
  readonly cleared = output<void>();
  readonly blurred = output<{ value: string; event: FocusEvent }>();
  readonly enterPress = output<string>();

  protected readonly cn = cn;
  private readonly cvaDisabled = signal(false);
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  protected readonly inputClasses = computed(() =>
    cn(
      'flex h-9 w-full min-w-0 rounded-md border border-neutral-300 bg-neutral-50 py-1 pl-9 pr-9 text-sm text-neutral-900',
      'placeholder:text-neutral-400 transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.className()
    )
  );

  private onChangeCb: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChangeCb(value);
  }
  protected onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit({ value: this.value(), event });
  }
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.enterPress.emit(this.value());
      this.search.emit(this.value());
    }
  }
  protected onClear(): void {
    this.value.set('');
    this.onChangeCb('');
    this.cleared.emit();
  }
  protected onSearchClick(): void {
    this.search.emit(this.value());
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCb = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
