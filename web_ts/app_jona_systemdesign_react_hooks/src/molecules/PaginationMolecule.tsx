// PaginationMolecule.tsx — Level 2: Molecule
// Inspired by shadcn/ui Pagination — page numbers, prev/next, ellipsis.
import React from 'react';
import { cn } from '../lib/cn';

interface PaginationMoleculeProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // pages shown around current, default 1
  className?: string;
}

// Build page range with ellipsis
function buildRange(current: number, total: number, siblings: number): (number | '...')[] {
  const delta = siblings + 2;
  const range: number[] = [];

  for (
    let i = Math.max(2, current - siblings);
    i <= Math.min(total - 1, current + siblings);
    i++
  ) {
    range.push(i);
  }

  const result: (number | '...')[] = [1];

  if (range[0] > 2) result.push('...');
  result.push(...range);
  if (range[range.length - 1] < total - 1) result.push('...');
  if (total > 1) result.push(total);

  // Deduplicate
  return result.filter((v, i, arr) => arr.indexOf(v) === i);
}

const ChevronLeft = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const PaginationMolecule: React.FC<PaginationMoleculeProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = buildRange(currentPage, totalPages, siblingCount);

  const btnBase = cn(
    'inline-flex items-center justify-center h-8 min-w-[2rem] px-2 rounded-token-sm text-sm',
    'transition-colors duration-150 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
    'disabled:pointer-events-none disabled:opacity-50'
  );

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      {/* Previous */}
      <button
        type="button"
        aria-label="Go to previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(btnBase, 'gap-1 pr-3 text-neutral-600 hover:bg-neutral-100 border border-neutral-200')}
      >
        <ChevronLeft />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Pages */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-neutral-400 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page as number)}
            className={cn(
              btnBase,
              page === currentPage
                ? 'bg-primary-600 text-white border border-primary-600'
                : 'text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        aria-label="Go to next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(btnBase, 'gap-1 pl-3 text-neutral-600 hover:bg-neutral-100 border border-neutral-200')}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight />
      </button>
    </nav>
  );
};
