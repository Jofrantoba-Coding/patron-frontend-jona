import { J_METRIC_CARD_TEMPLATE } from './JMetricCardView';
import type { InterJMetricCard } from './InterJMetricCard';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JMetricCard — métrica destacada (valor grande + etiqueta) para landing/reportes.
 */
@Component({
  selector: 'j-metric-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_METRIC_CARD_TEMPLATE,
})
export class JMetricCard {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex min-w-0 flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-5', this.className())
  );
}
