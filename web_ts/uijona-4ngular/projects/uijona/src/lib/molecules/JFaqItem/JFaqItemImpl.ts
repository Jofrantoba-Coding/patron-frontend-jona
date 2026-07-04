import { J_FAQ_ITEM_TEMPLATE } from './JFaqItemView';
import type { InterJFaqItem } from './InterJFaqItem';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JFaqItem — pregunta frecuente (tarjeta con pregunta y respuesta).
 */
@Component({
  selector: 'j-faq-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_FAQ_ITEM_TEMPLATE,
})
export class JFaqItem {
  readonly question = input.required<string>();
  readonly answer = input.required<string>();
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('rounded-xl border border-neutral-200 bg-neutral-50 p-6', this.className())
  );
}
