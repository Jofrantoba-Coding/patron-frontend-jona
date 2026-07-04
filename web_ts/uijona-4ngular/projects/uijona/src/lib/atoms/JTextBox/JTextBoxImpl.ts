import { J_TEXT_BOX_TEMPLATE } from './JTextBoxView';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import { JIconLeft, JIconRight } from './JIconSlots';
import {
  JTEXTBOX_DEFAULTS,
  JTEXTBOX_SIZE_CLASSES,
  JTEXTBOX_VARIANT_CLASSES,
  type JTextBoxSize,
  type JTextBoxVariant,
} from './InterJTextBox';

/**
 * JTextBox — input de texto con iconos internos, estado de error y eventos
 * normalizados (value-first). Implementa ControlValueAccessor: funciona con
 * `[(ngModel)]`, `formControl` y `[(value)]`.
 *
 * Iconos: proyecta `<span jIconLeft>…</span>` o `<span jIconRight>…</span>`.
 */
@Component({
  selector: 'j-text-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JTextBox), multi: true },
  ],
  template: J_TEXT_BOX_TEMPLATE,
})
export class JTextBox implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly placeholder = input<string>();
  readonly name = input<string>();
  readonly id = input<string>();
  readonly variant = input<JTextBoxVariant>(JTEXTBOX_DEFAULTS.variant);
  readonly size = input<JTextBoxSize>(JTEXTBOX_DEFAULTS.size);
  readonly type = input<string>(JTEXTBOX_DEFAULTS.type);
  readonly hasError = input<boolean>(JTEXTBOX_DEFAULTS.hasError);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly readOnly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly autoComplete = input<string>();
  readonly maxLength = input<number>();
  readonly minLength = input<number>();
  readonly pattern = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly focused = output<FocusEvent>();
  readonly blurred = output<{ value: string; event: FocusEvent }>();
  readonly enterPress = output<{ value: string; event: KeyboardEvent }>();
  readonly keydown = output<KeyboardEvent>();
  readonly cleared = output<void>();

  private readonly iconLeftRef = contentChild(JIconLeft);
  private readonly iconRightRef = contentChild(JIconRight);
  private readonly cvaDisabled = signal(false);

  protected readonly hasIconLeft = computed(() => !!this.iconLeftRef());
  protected readonly hasIconRight = computed(() => !!this.iconRightRef());
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  protected readonly classes = computed(() =>
    cn(
      'jtextbox',
      'w-full transition-colors duration-200',
      'placeholder:text-neutral-400',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      JTEXTBOX_VARIANT_CLASSES[this.variant()],
      JTEXTBOX_SIZE_CLASSES[this.size()],
      this.hasError()
        ? 'border-danger-500 focus-visible:ring-danger-500'
        : 'focus-visible:ring-primary-500',
      this.className()
    )
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  protected onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit({ value: this.value(), event });
  }

  protected onKeydown(event: KeyboardEvent): void {
    this.keydown.emit(event);
    if (event.key === 'Enter') {
      this.enterPress.emit({ value: this.value(), event });
    }
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
