import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JBADGE_DEFAULTS,
  type JBadgeVariant,
} from './InterJBadge';
import {
  JBADGE_VARIANT_CLASSES,
} from './JBadgeStyles';

/**
 * JBadge — indicador de estado. Contenido proyectado por defecto.
 */
@Component({
  selector: 'j-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JBadgeView.html',
})
export class JBadge {
  readonly variant = input<JBadgeVariant>(JBADGE_DEFAULTS.variant);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly classes = computed(() =>
    cn(
      'jbadge',
      'inline-flex items-center gap-1 rounded-full border',
      'px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200',
      JBADGE_VARIANT_CLASSES[this.variant()],
      this.className()
    )
  );
}
