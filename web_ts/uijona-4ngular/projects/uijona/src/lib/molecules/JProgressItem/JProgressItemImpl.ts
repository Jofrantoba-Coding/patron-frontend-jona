import { J_PROGRESS_ITEM_TEMPLATE } from './JProgressItemView';
import type { JProgressItemVariant, JProgressItemSize, InterJProgressItem } from './InterJProgressItem';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import { JProgress } from '../../atoms/JProgress';

const TEXT_SIZE: Record<JProgressItemSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const CARD_PADDING: Record<JProgressItemSize, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

const VALUE_COLOR: Record<JProgressItemVariant, string> = {
  default: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-warning-500',
  danger: 'text-danger-500',
};

/**
 * JProgressItem — métrica con label, porcentaje y barra de progreso (JProgress).
 */
@Component({
  selector: 'j-progress-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JProgress],
  host: { class: 'contents' },
  template: J_PROGRESS_ITEM_TEMPLATE,
})
export class JProgressItem {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly max = input<number>(100);
  readonly variant = input<JProgressItemVariant>('default');
  readonly size = input<JProgressItemSize>('md');
  readonly showValue = input<boolean>(true);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly cn = cn;
  protected readonly textSize = computed(() => TEXT_SIZE[this.size()]);
  protected readonly valueColor = computed(() => VALUE_COLOR[this.variant()]);
  protected readonly pct = computed(() => {
    const max = this.max();
    return Math.min(100, Math.max(0, max > 0 ? Math.round((this.value() / max) * 100) : 0));
  });
  protected readonly classes = computed(() =>
    cn('w-full rounded-lg border border-neutral-200 bg-white', CARD_PADDING[this.size()], this.className())
  );
}
