// JPaginationView.ts — JONA View (template puro)
export const J_PAGINATION_TEMPLATE = `
    @if (totalPages() > 1) {
      <nav aria-label="Pagination" [class]="cn('flex max-w-full items-center gap-1 overflow-x-auto', className())">
        <button
          type="button"
          aria-label="Go to previous page"
          [disabled]="currentPage() <= 1"
          (click)="onPrev()"
          [class]="cn(btnBase, 'gap-1 pr-3 text-neutral-600 hover:bg-neutral-100 border border-neutral-200')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span class="hidden sm:inline">Previous</span>
        </button>

        @for (page of pages(); track $index) {
          @if (page === '...') {
            <span class="shrink-0 px-2 text-neutral-400 select-none">…</span>
          } @else {
            <button
              type="button"
              [attr.aria-label]="'Page ' + page"
              [attr.aria-current]="page === currentPage() ? 'page' : null"
              (click)="pageChange.emit($any(page))"
              [class]="
                cn(btnBase, page === currentPage() ? 'bg-primary-600 text-white border border-primary-600' : 'text-neutral-700 hover:bg-neutral-100 border border-neutral-200')
              "
            >
              {{ page }}
            </button>
          }
        }

        <button
          type="button"
          aria-label="Go to next page"
          [disabled]="currentPage() >= totalPages()"
          (click)="onNext()"
          [class]="cn(btnBase, 'gap-1 pl-3 text-neutral-600 hover:bg-neutral-100 border border-neutral-200')"
        >
          <span class="hidden sm:inline">Next</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </nav>
    }
  `;

