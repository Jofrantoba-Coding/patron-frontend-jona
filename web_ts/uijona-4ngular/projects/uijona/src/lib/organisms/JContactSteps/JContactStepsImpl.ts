import { J_CONTACT_STEPS_TEMPLATE } from './JContactStepsView';
import type { ContactStepData, InterJContactSteps } from './InterJContactSteps';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import { JSectionHeading } from '../../molecules/JSectionHeading';
import { JNumberedStep } from '../../molecules/JNumberedStep';
/** JContactSteps — sección con encabezado y pasos numerados. */
@Component({
  selector: 'j-contact-steps',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JNumberedStep],
  host: { class: 'contents' },
  template: J_CONTACT_STEPS_TEMPLATE,
})
export class JContactSteps {
  readonly eyebrow = input<string>();
  readonly heading = input.required<string>();
  readonly steps = input.required<ContactStepData[]>();
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('w-full border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20', this.className())
  );
}
