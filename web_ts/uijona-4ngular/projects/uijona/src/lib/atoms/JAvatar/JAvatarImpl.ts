import { J_AVATAR_TEMPLATE } from './JAvatarView';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JAVATAR_DEFAULTS,
  JAVATAR_SHAPE_CLASSES,
  JAVATAR_SIZE_CLASSES,
  type JAvatarShape,
  type JAvatarSize,
} from './InterJAvatar';

/**
 * JAvatar — avatar con imagen, fallback a iniciales y forma configurable.
 */
@Component({
  selector: 'j-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_AVATAR_TEMPLATE,
})
export class JAvatar {
  readonly src = input<string>();
  readonly alt = input<string>(JAVATAR_DEFAULTS.alt);
  readonly initials = input<string>();
  readonly size = input<JAvatarSize>(JAVATAR_DEFAULTS.size);
  readonly shape = input<JAvatarShape>(JAVATAR_DEFAULTS.shape);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly imageError = output<void>();

  private readonly failedSrc = signal<string | null>(null);

  protected readonly showImage = computed(() => {
    const src = this.src();
    return !!src && this.failedSrc() !== src;
  });

  protected readonly label = computed(() => this.alt() || this.initials() || null);

  protected readonly classes = computed(() =>
    cn(
      'javatar',
      'bg-primary-100 text-primary-700 font-semibold',
      JAVATAR_SIZE_CLASSES[this.size()],
      JAVATAR_SHAPE_CLASSES[this.shape()],
      this.className()
    )
  );

  protected onError(): void {
    this.failedSrc.set(this.src() ?? null);
    this.imageError.emit();
  }
}
