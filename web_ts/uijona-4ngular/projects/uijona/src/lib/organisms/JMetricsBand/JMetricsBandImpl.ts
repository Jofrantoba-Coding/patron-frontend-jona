import { J_METRICS_BAND_TEMPLATE } from './JMetricsBandView';
import type { MetricItem, InterJMetricsBand } from './InterJMetricsBand';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/** JMetricsBand — franja oscura de métricas destacadas. */
@Component({
  selector: 'j-metrics-band',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_METRICS_BAND_TEMPLATE,
})
export class JMetricsBand {
  readonly metrics = input.required<MetricItem[]>();
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('w-full border-t border-neutral-800 bg-neutral-900 py-12', this.className())
  );
}
