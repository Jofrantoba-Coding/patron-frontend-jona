import { J_STAT_CARD_TEMPLATE, J_STAT_CARD_STYLES } from './JStatCardView';
import type { StatCardTone, StatCardTrend, InterJStatCard } from './InterJStatCard';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';

const TONE_CLASSES: Record<StatCardTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-600',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  info: 'bg-primary-50 text-primary-700',
};

const TREND_CLASSES: Record<StatCardTrend, string> = {
  up: 'text-success-700',
  down: 'text-danger-700',
  flat: 'text-neutral-500',
};

/**
 * JStatCard — métrica compacta para dashboards con tono, tendencia e icono
 * opcional (proyecta `<svg jIcon>`).
 */
@Component({
  selector: 'j-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_STAT_CARD_TEMPLATE,
  styles: J_STAT_CARD_STYLES,
})
export class JStatCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly description = input<string>();
  readonly tone = input<StatCardTone>('neutral');
  readonly trend = input<StatCardTrend>('flat');
  readonly trendLabel = input<string>();
  readonly valueFirst = input<boolean>(false);
  readonly className = input<string>('');

  protected readonly cn = cn;
  protected readonly trendClass = computed(() => TREND_CLASSES[this.trend()]);

  protected readonly classes = computed(() =>
    cn('min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5', this.className())
  );

  protected readonly iconClasses = computed(() =>
    cn(
      'jstat-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-md',
      TONE_CLASSES[this.tone()]
    )
  );
}
