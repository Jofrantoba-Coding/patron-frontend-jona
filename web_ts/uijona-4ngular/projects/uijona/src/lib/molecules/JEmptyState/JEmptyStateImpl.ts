import { J_EMPTY_STATE_TEMPLATE, J_EMPTY_STATE_STYLES } from './JEmptyStateView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import { JButton } from '../../atoms/JButton';
import type { JStyle } from '../../core/types';
import type { JEmptyStateAction } from './InterJEmptyState';

/**
 * JEmptyState — estado vacío con icono opcional (proyecta `<svg jIcon>`), título,
 * descripción y acciones.
 */
@Component({
  selector: 'j-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JButton],
  host: { class: 'contents' },
  template: J_EMPTY_STATE_TEMPLATE,
  styles: J_EMPTY_STATE_STYLES,
})
export class JEmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly actions = input<JEmptyStateAction[]>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly classes = computed(() =>
    cn(
      'flex w-full min-w-0 flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-white px-4 py-8 text-center sm:px-6 sm:py-10',
      this.className()
    )
  );
}
