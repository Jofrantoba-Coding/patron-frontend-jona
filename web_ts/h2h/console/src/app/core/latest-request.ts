import type { Observable, Subscription } from 'rxjs';

export interface LatestRequestObserver<T> {
  next: (value: T) => void;
  error?: (error: unknown) => void;
  settled?: () => void;
}

/**
 * Mantiene una sola lectura activa para una vista. Al iniciar otra, cancela la
 * anterior y evita que una respuesta tardía reemplace el filtro o la página actual.
 */
export class LatestRequest {
  private active: Subscription | null = null;
  private revision = 0;

  run<T>(source: Observable<T>, observer: LatestRequestObserver<T>): void {
    const revision = ++this.revision;
    this.active?.unsubscribe();
    this.active = source.subscribe({
      next: (value) => {
        if (revision === this.revision) observer.next(value);
      },
      error: (error) => {
        if (revision !== this.revision) return;
        observer.error?.(error);
        observer.settled?.();
      },
      complete: () => {
        if (revision === this.revision) observer.settled?.();
      },
    });
  }

  cancel(): void {
    this.revision += 1;
    this.active?.unsubscribe();
    this.active = null;
  }
}
