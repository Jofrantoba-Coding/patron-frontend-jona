import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JDOT_DEFAULTS,
  type JDotSize,
  type JDotTone,
} from './InterJDot';
import {
  JDOT_SIZE_CLASSES,
  JDOT_TONE_CLASSES,
} from './JDotStyles';

/**
 * JDot — punto indicador de estado, con halo opcional (pulse).
 */
@Component({
  selector: 'j-dot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JDotView.html',
})
export class JDot {
  readonly size = input<JDotSize>(JDOT_DEFAULTS.size);
  readonly tone = input<JDotTone>(JDOT_DEFAULTS.tone);
  readonly pulse = input<boolean>(JDOT_DEFAULTS.pulse);
  readonly ariaLabel = input<string>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly cn = cn;
  protected readonly sizeClass = computed(() => JDOT_SIZE_CLASSES[this.size()]);
  protected readonly toneClass = computed(() => JDOT_TONE_CLASSES[this.tone()]);
}
