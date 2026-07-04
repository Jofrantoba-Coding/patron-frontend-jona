import { J_PAGINATION_TEMPLATE } from './JPaginationView';
import type { InterJPagination } from './InterJPagination';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../../core/cn';

function buildRange(current: number, total: number, siblings: number): (number | '...')[] {
  const range: number[] = [];
  for (let i = Math.max(2, current - siblings); i <= Math.min(total - 1, current + siblings); i++) {
    range.push(i);
  }
  const result: (number | '...')[] = [1];
  if (range[0] > 2) result.push('...');
  result.push(...range);
  if (range[range.length - 1] < total - 1) result.push('...');
  if (total > 1) result.push(total);
  return result.filter((v, i, arr) => arr.indexOf(v) === i);
}

/**
 * JPagination — navegación paginada con elipsis. No renderiza nada si totalPages<=1.
 */
@Component({
  selector: 'j-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_PAGINATION_TEMPLATE,
})
export class JPagination {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly siblingCount = input<number>(1);
  readonly className = input<string>('');

  readonly pageChange = output<number>();
  readonly previous = output<number>();
  readonly next = output<number>();
  readonly firstPageReached = output<void>();
  readonly lastPageReached = output<void>();

  protected readonly cn = cn;
  protected readonly btnBase =
    'inline-flex items-center justify-center h-8 min-w-[2rem] px-2 rounded text-sm transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50';

  protected readonly pages = computed(() =>
    buildRange(this.currentPage(), this.totalPages(), this.siblingCount())
  );

  protected onPrev(): void {
    if (this.currentPage() <= 1) {
      this.firstPageReached.emit();
      return;
    }
    this.previous.emit(this.currentPage());
    this.pageChange.emit(this.currentPage() - 1);
  }

  protected onNext(): void {
    if (this.currentPage() >= this.totalPages()) {
      this.lastPageReached.emit();
      return;
    }
    this.next.emit(this.currentPage());
    this.pageChange.emit(this.currentPage() + 1);
  }
}
