import { J_SWITCH_TEMPLATE } from './JSwitchView';
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
  JSWITCH_DEFAULTS,
  JSWITCH_THUMB_SIZE,
  JSWITCH_THUMB_TRANSLATE,
  JSWITCH_TRACK_SIZE,
  type JSwitchSize,
} from './InterJSwitch';

/**
 * JSwitch — toggle booleano accesible (role=switch). Implementa
 * ControlValueAccessor (`[(ngModel)]`, `formControl`, `[(checked)]`).
 */
@Component({
  selector: 'j-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JSwitch), multi: true },
  ],
  template: J_SWITCH_TEMPLATE,
})
export class JSwitch implements ControlValueAccessor {
  readonly checked = model<boolean>(false);
  readonly hasError = input<boolean>(JSWITCH_DEFAULTS.hasError);
  readonly disabledInput = input<boolean>(JSWITCH_DEFAULTS.disabled, { alias: 'disabled' });
  readonly size = input<JSwitchSize>(JSWITCH_DEFAULTS.size);
  readonly id = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaLabel = input<string>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly toggled = output<{ checked: boolean; event: MouseEvent }>();

  private readonly cvaDisabled = signal(false);
  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());

  protected readonly trackClasses = computed(() =>
    cn(
      'jswitch',
      'relative inline-flex items-center rounded-full transition-colors duration-200 cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
      'disabled:pointer-events-none disabled:opacity-50',
      JSWITCH_TRACK_SIZE[this.size()],
      this.checked()
        ? this.hasError()
          ? 'bg-danger-500'
          : 'bg-primary-600'
        : this.hasError()
          ? 'bg-danger-200'
          : 'bg-neutral-300',
      this.className()
    )
  );

  protected readonly thumbClasses = computed(() => {
    const t = JSWITCH_THUMB_TRANSLATE[this.size()];
    return cn(
      'inline-block rounded-full bg-white shadow transition-transform duration-200',
      JSWITCH_THUMB_SIZE[this.size()],
      this.checked() ? t.on : t.off
    );
  });

  private onChange: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.toggled.emit({ checked: next, event });
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────
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
