import { J_FORM_FIELD_TEMPLATE } from './JFormFieldView';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';
import { JLabel } from '../../atoms/JLabel';
import { JTextBox } from '../../atoms/JTextBox';
import { JFORMFIELD_DEFAULTS, type JFormFieldOrientation } from './InterJFormField';

/**
 * JFormField — campo de formulario con label, ayuda, error y JTextBox integrado.
 * Implementa ControlValueAccessor.
 */
@Component({
  selector: 'j-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JLabel, JTextBox],
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JFormField), multi: true },
  ],
  template: J_FORM_FIELD_TEMPLATE,
})
export class JFormField implements ControlValueAccessor {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly errorMessage = input<string>();
  readonly description = input<string>();
  readonly orientation = input<JFormFieldOrientation>(JFORMFIELD_DEFAULTS.orientation);
  readonly required = input<boolean>(false);
  readonly placeholder = input<string>();
  readonly type = input<string>('text');
  readonly value = model<string>('');
  readonly className = input<string>('');

  readonly focused = output<FocusEvent>();
  readonly enterPress = output<string>();

  protected readonly cn = cn;
  protected readonly hasError = computed(() => !!this.errorMessage());

  protected readonly describedBy = computed(() => {
    const parts = [
      this.description() && !this.hasError() ? `${this.id()}-desc` : null,
      this.hasError() ? `${this.id()}-error` : null,
    ].filter(Boolean);
    return parts.length ? parts.join(' ') : undefined;
  });

  protected readonly wrapperClasses = computed(() =>
    cn(
      'flex flex-col gap-1.5',
      this.orientation() === 'horizontal' && 'sm:flex-row sm:items-center sm:gap-4',
      this.className()
    )
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected onValueChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected onBlur(): void {
    this.onTouched();
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
}
