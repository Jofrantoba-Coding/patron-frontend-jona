import { J_SECTION_HEADING_TEMPLATE } from './JSectionHeadingView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';

/**
 * JSectionHeading — encabezado de sección con eyebrow, título y descripción.
 */
@Component({
  selector: 'j-section-heading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_SECTION_HEADING_TEMPLATE,
})
export class JSectionHeading {
  readonly eyebrow = input<string>();
  readonly heading = input.required<string>();
  readonly description = input<string>();
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex min-w-0 flex-col gap-2', this.className())
  );
}
