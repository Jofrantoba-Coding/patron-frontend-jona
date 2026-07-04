import { J_IMAGEN_TEMPLATE } from './JImagenView';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JIMAGEN_ASPECT_RATIO_CLASSES,
  JIMAGEN_DEFAULTS,
  JIMAGEN_FIT_CLASSES,
  JIMAGEN_RADIUS_CLASSES,
  type JImagenAspectRatio,
  type JImagenFit,
  type JImagenRadius,
} from './InterJImagen';

/**
 * JImagen — imagen con object-fit, radio, aspect-ratio y fallback opcional.
 */
@Component({
  selector: 'j-imagen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_IMAGEN_TEMPLATE,
})
export class JImagen {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly fit = input<JImagenFit>(JIMAGEN_DEFAULTS.fit);
  readonly radius = input<JImagenRadius>(JIMAGEN_DEFAULTS.radius);
  readonly aspectRatio = input<JImagenAspectRatio>(JIMAGEN_DEFAULTS.aspectRatio);
  readonly block = input<boolean>(JIMAGEN_DEFAULTS.block);
  readonly fallbackSrc = input<string>();
  readonly loading = input<'lazy' | 'eager'>(JIMAGEN_DEFAULTS.loading);
  readonly decoding = input<'async' | 'auto' | 'sync'>(JIMAGEN_DEFAULTS.decoding);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly imageError = output<void>();

  private readonly erroredSrc = signal<string | null>(null);

  protected readonly currentSrc = computed(() => {
    const fallback = this.fallbackSrc();
    if (this.erroredSrc() === this.src() && fallback) {
      return fallback;
    }
    return this.src();
  });

  protected readonly classes = computed(() =>
    cn(
      'jimagen',
      'max-w-full min-w-0 shrink-0',
      this.block() ? 'block w-full' : 'inline-block',
      JIMAGEN_FIT_CLASSES[this.fit()],
      JIMAGEN_RADIUS_CLASSES[this.radius()],
      JIMAGEN_ASPECT_RATIO_CLASSES[this.aspectRatio()],
      this.className()
    )
  );

  protected onError(): void {
    this.erroredSrc.set(this.src());
    this.imageError.emit();
  }
}
