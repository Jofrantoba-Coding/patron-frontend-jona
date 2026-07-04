import { J_RELATED_ITEM_TEMPLATE } from './JRelatedItemView';
import type { InterJRelatedItem } from './InterJRelatedItem';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JRelatedItem — enlace relacionado con nombre, resultado y label de acción.
 */
@Component({
  selector: 'j-related-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_RELATED_ITEM_TEMPLATE,
})
export class JRelatedItem {
  readonly name = input.required<string>();
  readonly outcome = input.required<string>();
  readonly href = input.required<string>();
  readonly linkLabel = input<string>('Ver más →');
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'flex min-w-0 flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-5 no-underline transition-shadow duration-200 hover:shadow-md',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
      this.className()
    )
  );
}
