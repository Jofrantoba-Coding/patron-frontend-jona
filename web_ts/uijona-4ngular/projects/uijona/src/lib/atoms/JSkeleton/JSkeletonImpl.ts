import { J_SKELETON_TEMPLATE } from './JSkeletonView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JSKELETON_DEFAULTS,
  JSKELETON_VARIANT_CLASSES,
  type JSkeletonVariant,
} from './InterJSkeleton';

/**
 * JSkeleton — placeholder de carga (pulse, wave o estatico).
 */
@Component({
  selector: 'j-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_SKELETON_TEMPLATE,
})
export class JSkeleton {
  readonly circle = input<boolean>(JSKELETON_DEFAULTS.circle);
  readonly variant = input<JSkeletonVariant>(JSKELETON_DEFAULTS.variant);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly classes = computed(() =>
    cn(
      'jskeleton',
      JSKELETON_VARIANT_CLASSES[this.variant()],
      this.circle() ? 'rounded-full' : 'rounded',
      this.className()
    )
  );
}
