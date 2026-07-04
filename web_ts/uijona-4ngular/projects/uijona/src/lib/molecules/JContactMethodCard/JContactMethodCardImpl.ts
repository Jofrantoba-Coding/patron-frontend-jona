import { J_CONTACT_METHOD_CARD_TEMPLATE } from './JContactMethodCardView';
import type { InterJContactMethodCard } from './InterJContactMethodCard';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JContactMethodCard — medio de contacto con icono (emoji), texto y acción/enlace.
 */
@Component({
  selector: 'j-contact-method-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_CONTACT_METHOD_CARD_TEMPLATE,
})
export class JContactMethodCard {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly description = input.required<string>();
  readonly href = input.required<string>();
  readonly actionLabel = input<string>();
  readonly isPrimary = input<boolean>(false);
  readonly className = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      'flex min-w-0 flex-col gap-2.5 rounded-2xl border p-7 transition-shadow duration-200 hover:shadow-lg',
      this.isPrimary() ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-neutral-50',
      this.className()
    )
  );
}
