import { J_RATING_TEMPLATE } from './JRatingView';
import type { JRatingSize, InterJRating } from './InterJRating';
import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { cn } from '../../core/cn';

const SIZE_CLASSES: Record<JRatingSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

/**
 * JRating — selector o indicador de calificación por estrellas.
 */
@Component({
  selector: 'j-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_RATING_TEMPLATE,
})
export class JRating {
  readonly value = model<number>(0);
  readonly max = input<number>(5);
  readonly readOnly = input<boolean>(false);
  readonly size = input<JRatingSize>('md');
  readonly className = input<string>('');

  readonly hoverChange = output<number | null>();

  protected readonly cn = cn;
  private readonly hovered = signal<number | null>(null);
  protected readonly stars = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));
  private readonly active = computed(() => this.hovered() ?? this.value());

  protected readonly buttonClasses = computed(() =>
    cn(
      'rounded-sm transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
      this.readOnly() ? 'pointer-events-none cursor-default' : 'cursor-pointer',
      SIZE_CLASSES[this.size()]
    )
  );

  protected starClasses(star: number): string {
    return cn(
      'h-full w-full transition-colors duration-150',
      star <= this.active()
        ? 'fill-yellow-400 stroke-yellow-400'
        : 'fill-neutral-200 stroke-neutral-300'
    );
  }

  protected onStarClick(star: number): void {
    if (this.readOnly()) return;
    this.value.set(star);
  }
  protected onStarEnter(star: number): void {
    if (this.readOnly()) return;
    this.hovered.set(star);
    this.hoverChange.emit(star);
  }
  protected onStarLeave(): void {
    if (this.readOnly()) return;
    this.hovered.set(null);
    this.hoverChange.emit(null);
  }
}
