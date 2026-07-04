import { J_SEPARATOR_TEMPLATE } from './JSeparatorView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import { JSEPARATOR_DEFAULTS, type JSeparatorOrientation } from './InterJSeparator';

/**
 * JSeparator — separador horizontal o vertical.
 */
@Component({
  selector: 'j-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_SEPARATOR_TEMPLATE,
})
export class JSeparator {
  readonly orientation = input<JSeparatorOrientation>(JSEPARATOR_DEFAULTS.orientation);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly classes = computed(() =>
    cn(
      'jseparator',
      'bg-neutral-200 shrink-0',
      this.orientation() === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      this.className()
    )
  );
}
