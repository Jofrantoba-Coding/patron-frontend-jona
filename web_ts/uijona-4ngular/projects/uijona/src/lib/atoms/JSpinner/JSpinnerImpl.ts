import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JSPINNER_DEFAULTS,
  type JSpinnerColor,
  type JSpinnerSize,
} from './InterJSpinner';
import {
  JSPINNER_COLOR_CLASSES,
  JSPINNER_SIZE_CLASSES,
} from './JSpinnerStyles';

/**
 * JSpinner — indicador de carga.
 * Patron JONA: `inter-j-spinner.ts` es el contrato + clases; esta clase adapta
 * defaults y estado; el template es la vista pura.
 */
@Component({
  selector: 'j-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JSpinnerView.html',
})
export class JSpinner {
  readonly size = input<JSpinnerSize>(JSPINNER_DEFAULTS.size);
  readonly color = input<JSpinnerColor>(JSPINNER_DEFAULTS.color);
  readonly label = input<string>(JSPINNER_DEFAULTS.label);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly classes = computed(() =>
    cn(
      'jspinner',
      'inline-block rounded-full animate-spin',
      JSPINNER_SIZE_CLASSES[this.size()],
      JSPINNER_COLOR_CLASSES[this.color()],
      this.className()
    )
  );
}
