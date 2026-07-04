import { J_CHECK_BOX_TEMPLATE } from './JCheckBoxView';
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
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JCHECKBOX_DEFAULTS,
  JCHECKBOX_SIZE_CLASSES,
  JCHECKBOX_WRAPPER_CLASSES,
  type JCheckBoxLabelPosition,
  type JCheckBoxSize,
} from './InterJCheckBox';

/**
 * JCheckBox — checkbox accesible con label integrado, estado indeterminado y
 * error. Implementa ControlValueAccessor (`[(ngModel)]`, `formControl`,
 * `[(checked)]`).
 */
@Component({
  selector: 'j-check-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JCheckBox), multi: true },
  ],
  template: J_CHECK_BOX_TEMPLATE,
  imports: [NgTemplateOutlet],
})
export class JCheckBox implements ControlValueAccessor {
  readonly checked = model<boolean>(false);
  readonly indeterminate = input<boolean>(JCHECKBOX_DEFAULTS.indeterminate);
  readonly hasError = input<boolean>(JCHECKBOX_DEFAULTS.hasError);
  readonly disabledInput = input<boolean>(JCHECKBOX_DEFAULTS.disabled, { alias: 'disabled' });
  readonly size = input<JCheckBoxSize>(JCHECKBOX_DEFAULTS.size);
  readonly label = input<string>();
  readonly labelPosition = input<JCheckBoxLabelPosition>(JCHECKBOX_DEFAULTS.labelPosition);
  readonly labelClassName = input<string>('');
  readonly id = input<string>();
  readonly name = input<string>();
  readonly value = input<string>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected readonly cn = cn;
  private readonly el = viewChild<ElementRef<HTMLInputElement>>('el');
  private readonly cvaDisabled = signal(false);

  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());
  protected readonly showIndeterminate = computed(
    () => this.indeterminate() && !this.checked()
  );

  protected readonly wrapperClasses = computed(() =>
    cn(
      'inline-flex',
      JCHECKBOX_WRAPPER_CLASSES[this.labelPosition()],
      this.disabled() ? 'cursor-not-allowed' : 'cursor-pointer'
    )
  );

  protected readonly boxClasses = computed(() =>
    cn(
      'jcheckbox',
      JCHECKBOX_SIZE_CLASSES[this.size()],
      this.hasError()
        ? 'border-danger-500 accent-danger-500'
        : 'border-neutral-300 accent-primary-600',
      this.className()
    )
  );

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const el = this.el()?.nativeElement;
      if (el) el.indeterminate = this.showIndeterminate();
    });
  }

  protected onChangeEvent(event: Event): void {
    if (this.disabled()) return;
    const checked = (event.target as HTMLInputElement).checked;
    this.checked.set(checked);
    this.onChange(checked);
  }

  protected onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
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
