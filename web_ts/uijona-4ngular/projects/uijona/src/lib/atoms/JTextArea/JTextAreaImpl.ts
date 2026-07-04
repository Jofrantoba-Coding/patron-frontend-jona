import { J_TEXT_AREA_TEMPLATE } from './JTextAreaView';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JTEXTAREA_DEFAULTS,
  JTEXTAREA_RESIZE_CLASSES,
  JTEXTAREA_SIZE_CLASSES,
  JTEXTAREA_VARIANT_CLASSES,
  type JTextAreaResize,
  type JTextAreaSize,
  type JTextAreaVariant,
} from './InterJTextArea';

/**
 * JTextArea — campo multilinea con autoresize opcional. Implementa
 * ControlValueAccessor (`[(ngModel)]`, `formControl`, `[(value)]`).
 */
@Component({
  selector: 'j-text-area',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JTextArea), multi: true },
  ],
  template: J_TEXT_AREA_TEMPLATE,
})
export class JTextArea implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly hasError = input<boolean>(JTEXTAREA_DEFAULTS.hasError);
  readonly autoResize = input<boolean>(JTEXTAREA_DEFAULTS.autoResize);
  readonly resize = input<JTextAreaResize>(JTEXTAREA_DEFAULTS.resize);
  readonly disabledInput = input<boolean>(JTEXTAREA_DEFAULTS.disabled, { alias: 'disabled' });
  readonly size = input<JTextAreaSize>(JTEXTAREA_DEFAULTS.size);
  readonly variant = input<JTextAreaVariant>(JTEXTAREA_DEFAULTS.variant);
  readonly id = input<string>();
  readonly name = input<string>();
  readonly placeholder = input<string>();
  readonly required = input<boolean>(false);
  readonly rows = input<number>();
  readonly maxLength = input<number>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly focused = output<FocusEvent>();
  readonly blurred = output<{ value: string; event: FocusEvent }>();
  readonly keydown = output<KeyboardEvent>();

  private readonly el = viewChild<ElementRef<HTMLTextAreaElement>>('el');
  private readonly cvaDisabled = signal(false);

  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  protected readonly classes = computed(() =>
    cn(
      'jtextarea',
      'w-full rounded-md border text-neutral-900',
      'placeholder:text-neutral-400 transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      JTEXTAREA_SIZE_CLASSES[this.size()],
      JTEXTAREA_VARIANT_CLASSES[this.variant()],
      JTEXTAREA_RESIZE_CLASSES[this.resize()],
      this.hasError()
        ? 'border-danger-500 focus-visible:ring-danger-500'
        : 'focus-visible:ring-primary-500',
      this.className()
    )
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Autoresize reactivo ante cambios de value/autoResize
    effect(() => {
      this.value();
      if (this.autoResize()) this.updateHeight();
    });
  }

  private updateHeight(): void {
    const el = this.el()?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value.set(value);
    this.onChange(value);
    if (this.autoResize()) this.updateHeight();
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
