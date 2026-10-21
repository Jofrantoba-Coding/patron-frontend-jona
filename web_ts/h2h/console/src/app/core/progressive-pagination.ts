import { computed, signal } from '@angular/core';

export interface ProgressivePage<T> {
  items: T[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface ProgressiveToken {
  readonly revision: number;
  readonly page: number;
}

/**
 * Estado independiente para la lista acumulada de móvil.
 * La tabla paginada de escritorio conserva sus propios datos y página.
 */
export class ProgressivePagination<T> {
  readonly items = signal<T[]>([]);
  readonly total = signal(0);
  readonly loadedPage = signal(0);
  readonly pageSize = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly exhausted = signal(false);
  readonly hasMore = computed(() =>
    !this.exhausted() && this.loadedPage() * this.pageSize() < this.total()
  );

  private revision = 0;

  constructor(private readonly keyOf: (item: T) => string) {}

  reset(): void {
    this.revision += 1;
    this.items.set([]);
    this.total.set(0);
    this.loadedPage.set(0);
    this.pageSize.set(0);
    this.exhausted.set(false);
    this.loading.set(false);
    this.error.set(null);
  }

  seed(page: ProgressivePage<T>): void {
    this.revision += 1;
    this.items.set(this.unique(page.items));
    this.total.set(page.pagination.total);
    this.loadedPage.set(page.pagination.page);
    this.pageSize.set(page.pagination.pageSize);
    this.exhausted.set(page.items.length === 0);
    this.loading.set(false);
    this.error.set(null);
  }

  beginNext(): ProgressiveToken | null {
    if (this.loading() || !this.hasMore()) return null;
    this.loading.set(true);
    this.error.set(null);
    return { revision: this.revision, page: this.loadedPage() + 1 };
  }

  resolve(token: ProgressiveToken, page: ProgressivePage<T>): boolean {
    if (token.revision !== this.revision) return false;
    this.items.set(this.unique([...this.items(), ...page.items]));
    this.total.set(page.pagination.total);
    this.loadedPage.set(token.page);
    this.pageSize.set(page.pagination.pageSize);
    this.exhausted.set(
      page.items.length === 0 || token.page * page.pagination.pageSize >= page.pagination.total
    );
    this.loading.set(false);
    this.error.set(null);
    return true;
  }

  reject(token: ProgressiveToken, message: string): boolean {
    if (token.revision !== this.revision) return false;
    this.loading.set(false);
    this.error.set(message);
    return true;
  }

  cancel(): void {
    this.revision += 1;
    this.loading.set(false);
  }

  private unique(items: T[]): T[] {
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = this.keyOf(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

