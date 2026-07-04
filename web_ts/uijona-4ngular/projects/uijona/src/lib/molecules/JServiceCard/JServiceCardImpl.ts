import { J_SERVICE_CARD_TEMPLATE } from './JServiceCardView';
import type { InterJServiceCard } from './InterJServiceCard';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JServiceCard — tarjeta de servicio con icono (emoji), título, descripción y
 * "proof" opcional. Si hay `href` se renderiza como enlace.
 */
@Component({
  selector: 'j-service-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { class: 'contents' },
  template: J_SERVICE_CARD_TEMPLATE,
})
export class JServiceCard {
  readonly icon = input<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly proof = input<string>();
  readonly href = input<string>();
  readonly className = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      'group flex min-w-0 flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 no-underline transition-all duration-200',
      this.href() &&
        'hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
      this.className()
    )
  );
}
