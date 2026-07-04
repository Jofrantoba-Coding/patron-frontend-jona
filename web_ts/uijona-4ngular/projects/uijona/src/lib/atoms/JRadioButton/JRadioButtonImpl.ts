import { J_RADIO_BUTTON_TEMPLATE } from './JRadioButtonView';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JRADIOBUTTON_DEFAULTS,
  JRADIOBUTTON_WRAPPER_CLASSES,
  type JRadioButtonLabelPosition,
} from './InterJRadioButton';

/**
 * JRadioButton — radio input base con label integrado. Normalmente se agrupa con
 * JRadioGroup, que gestiona la seleccion.
 */
@Component({
  selector: 'j-radio-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { class: 'contents' },
  template: J_RADIO_BUTTON_TEMPLATE,
})
export class JRadioButton {
  readonly checked = input<boolean>(false);
  readonly hasError = input<boolean>(JRADIOBUTTON_DEFAULTS.hasError);
  readonly disabled = input<boolean>(JRADIOBUTTON_DEFAULTS.disabled);
  readonly id = input<string>();
  readonly name = input<string>();
  readonly value = input<string>('');
  readonly label = input<string>();
  readonly labelPosition = input<JRadioButtonLabelPosition>(JRADIOBUTTON_DEFAULTS.labelPosition);
  readonly labelClassName = input<string>('');
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly checkedChange = output<{ checked: boolean; value: string; event: Event }>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  protected readonly cn = cn;

  protected readonly wrapperClasses = computed(() =>
    cn(
      'inline-flex',
      JRADIOBUTTON_WRAPPER_CLASSES[this.labelPosition()],
      this.disabled() ? 'cursor-not-allowed' : 'cursor-pointer'
    )
  );

  protected readonly radioClasses = computed(() =>
    cn(
      'jradiobutton',
      'h-4 w-4 border cursor-pointer',
      'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500',
      'disabled:pointer-events-none disabled:opacity-50',
      this.hasError()
        ? 'border-danger-500 text-danger-500'
        : 'border-neutral-300 text-primary-600',
      this.className()
    )
  );

  protected onChangeEvent(event: Event): void {
    if (this.disabled()) return;
    const target = event.target as HTMLInputElement;
    this.checkedChange.emit({ checked: target.checked, value: target.value, event });
  }
}
