import { Directive, ElementRef, afterNextRender, inject, input, OnDestroy, output } from '@angular/core';

/** Dispara una carga al aproximarse al viewport; el elemento sigue siendo un botón manual. */
@Directive({
  selector: '[appProgressiveLoad]',
  standalone: true,
})
export class ProgressiveLoadDirective implements OnDestroy {
  readonly appProgressiveLoad = input(true);
  readonly progressiveLoad = output<void>();

  private readonly element = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => this.observe());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private observe(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && this.appProgressiveLoad()) {
          this.progressiveLoad.emit();
        }
      },
      { rootMargin: '320px 0px' }
    );
    this.observer.observe(this.element.nativeElement);
  }
}
