import { J_NUMBERED_STEP_TEMPLATE } from './JNumberedStepView';
import type { InterJNumberedStep } from './InterJNumberedStep';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JNumberedStep — paso numerado con título y descripción.
 */
@Component({
  selector: 'j-numbered-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_NUMBERED_STEP_TEMPLATE,
})
export class JNumberedStep {
  readonly num = input.required<string>();
  readonly title = input.required<string>();
  readonly body = input.required<string>();
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex items-start gap-5 rounded-xl border border-neutral-200 bg-white p-6', this.className())
  );
}
