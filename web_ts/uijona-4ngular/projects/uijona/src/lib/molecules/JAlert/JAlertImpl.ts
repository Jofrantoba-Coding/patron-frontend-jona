import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import { cn } from '../../core/cn';
import { JIconSlot } from '../../core/slots';
import type { JStyle } from '../../core/types';
import {
  JALERT_DEFAULTS,
  type JAlertVariant,
} from './InterJAlert';
import {
  JALERT_DISMISS_VARIANT_CLASSES,
  JALERT_VARIANT_CLASSES,
} from './JAlertStyles';

/**
 * JAlert — mensaje contextual con variante, título, icono opcional (proyecta
 * `<svg jIcon>`) y cierre opcional.
 */
@Component({
  selector: 'j-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JAlertView.html',
  styleUrl: './JAlertView.css',
})
export class JAlert {
  readonly variant = input<JAlertVariant>(JALERT_DEFAULTS.variant);
  readonly title = input<string>();
  readonly dismissible = input<boolean>(JALERT_DEFAULTS.dismissible);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly dismissed = output<void>();

  private readonly iconRef = contentChild(JIconSlot);
  protected readonly hasIcon = computed(() => !!this.iconRef());

  protected readonly classes = computed(() =>
    cn(
      'relative w-full min-w-0 rounded-md border p-4',
      this.hasIcon() && 'pl-11',
      this.dismissible() && 'pr-10',
      JALERT_VARIANT_CLASSES[this.variant()],
      this.className()
    )
  );

  protected readonly dismissClasses = computed(() =>
    cn(
      'absolute right-3 top-3 rounded p-0.5 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
      JALERT_DISMISS_VARIANT_CLASSES[this.variant()]
    )
  );
}
